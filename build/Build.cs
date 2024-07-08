using System;
using System.Linq;
using System.Text;
using Nuke.Common;
using Nuke.Common.CI;
using Nuke.Common.CI.GitHubActions;
using Nuke.Common.Execution;
using Nuke.Common.Git;
using Nuke.Common.IO;
using Nuke.Common.ProjectModel;
using Nuke.Common.Tooling;
using Nuke.Common.Tools.GitHub;
using Nuke.Common.Tools.GitVersion;
using Nuke.Common.Tools.Npm;
using Nuke.Common.Utilities.Collections;
using Octokit;
using static Nuke.Common.EnvironmentInfo;
using static Nuke.Common.IO.FileSystemTasks;
using static Nuke.Common.IO.PathConstruction;
using static Nuke.Common.Tools.Git.GitTasks;
using static Nuke.Common.Tools.Npm.NpmTasks;

[GitHubActions(
  "PR_Validation",
  GitHubActionsImage.UbuntuLatest,
  ImportSecrets = new[] { nameof(GithubToken) },
  OnPullRequestBranches = new[] { "main", "develop", "release/*" },
  InvokedTargets = new[] { nameof(Compile) }
  )]
[GitHubActions(
    "Deploy",
    GitHubActionsImage.UbuntuLatest,
    ImportSecrets = new[] { nameof(NpmToken), "NPM_TOKEN" },
    OnPushBranches = new[] { "main", "release/*" },
    InvokedTargets = new[] { nameof(Deploy) }
)]
class Build : NukeBuild
{
    /// Support plugins are available for:
    ///   - JetBrains ReSharper        https://nuke.build/resharper
    ///   - JetBrains Rider            https://nuke.build/rider
    ///   - Microsoft VisualStudio     https://nuke.build/visualstudio
    ///   - Microsoft VSCode           https://nuke.build/vscode

    public static int Main () => Execute<Build>(x => x.Compile);

    [Parameter("Configuration to build - Default is 'Debug' (local) or 'Release' (server)")]
    readonly Configuration Configuration = IsLocalBuild ? Configuration.Debug : Configuration.Release;
    [Parameter("Github Token")]
    readonly string GithubToken;
    [Parameter("Npm Token")]
    readonly string NpmToken;

    [GitRepository] readonly GitRepository GitRepository;
    [GitVersion] readonly GitVersion GitVersion;

    GitHubClient gitHubClient;
    string releaseNotes = "";
    Release release;


    // Project information
    private const string organizationName = "nvisionative";
    private const string repositoryName = "nvQuickLoanCalculator";

    Target Restore => _ => _
        .Executes(() =>
        {
            NpmInstall(s => s
                .SetProcessWorkingDirectory(RootDirectory)
            );  
        });

    Target TagRelease => _ => _
    .OnlyWhenDynamic(() => GitRepository.IsOnMainOrMasterBranch() || GitRepository.IsOnReleaseBranch())
    .OnlyWhenDynamic(() => !string.IsNullOrWhiteSpace(GithubToken))
    .Executes(() =>
    {
        var version = GitRepository.IsOnMainOrMasterBranch() ? GitVersion.MajorMinorPatch : GitVersion.SemVer;
        Git($"tag v{version}");
        Git($"push origin --tags");
    });

    Target SetVersion => _ => _
    .DependsOn(TagRelease)
    .OnlyWhenDynamic(() => GitRepository.IsOnMainBranch() || GitRepository.IsOnReleaseBranch())
    .Executes(() =>
    {
        var version = GitRepository.IsOnMainBranch() ? GitVersion.MajorMinorPatch : GitVersion.NuGetVersionV2;
        Npm($"version {version} --allow-same-version --git-tag-version false", RootDirectory);
    });

    Target Compile => _ => _
        .DependsOn(Restore)
        .DependsOn(SetVersion)
        .Executes(() =>
        {
            NpmRun(s => s
                .SetProcessWorkingDirectory(RootDirectory)
                .SetCommand("build"));
        });

    Target SetupGithubActor => _ => _
        .Executes(() =>
        {
        var actor = Environment.GetEnvironmentVariable("GITHUB_ACTOR");
        Git($"config --global user.name '{actor}'");
        Git($"config --global user.email '{actor}@github.com'");
        if (IsServerBuild)
        {
            Git($"remote set-url origin https://{actor}:{GithubToken}@github.com/{GitRepository.GetGitHubOwner()}/{GitRepository.GetGitHubName()}.git");
        }
        });

    Target SetupGitHubClient => _ => _
        .OnlyWhenDynamic(() => !string.IsNullOrWhiteSpace(GithubToken))
        .DependsOn(SetupGithubActor)
        .Executes(() =>
        {
        if (GitRepository.IsOnMainOrMasterBranch() || GitRepository.IsOnReleaseBranch())
        {
            gitHubClient = new GitHubClient(new ProductHeaderValue("Nuke"));
            var tokenAuth = new Credentials(GithubToken);
            gitHubClient.Credentials = tokenAuth;
        }
        });

    Target GenerateReleaseNotes => _ => _
        .OnlyWhenDynamic(() => GitRepository.IsOnMainOrMasterBranch() || GitRepository.IsOnReleaseBranch())
        .OnlyWhenDynamic(() => !string.IsNullOrWhiteSpace(GithubToken))
        .DependsOn(SetupGitHubClient)
        .DependsOn(TagRelease)
        .Executes(() =>
        {
        // Get the milestone
        var milestone = gitHubClient.Issue.Milestone.GetAllForRepository(organizationName, repositoryName).Result.Where(m => m.Title == GitVersion.MajorMinorPatch).FirstOrDefault();
        if (milestone == null)
        {
            Serilog.Log.Warning("Milestone not found for this version");
            releaseNotes = "No release notes for this version.";
            return;
        }

        // Get the PRs
        var prRequest = new PullRequestRequest()
        {
            State = ItemStateFilter.All
        };
        var pullRequests = gitHubClient.Repository.PullRequest.GetAllForRepository(organizationName, repositoryName, prRequest).Result.Where(p =>
            p.Milestone?.Title == milestone.Title &&
            p.Merged == true &&
            p.Milestone?.Title == GitVersion.MajorMinorPatch);

        // Build release notes
        var releaseNotesBuilder = new StringBuilder();
        releaseNotesBuilder.AppendLine($"# {repositoryName} {milestone.Title}")
            .AppendLine("")
            .AppendLine($"A total of {pullRequests.Count()} pull requests where merged in this release.").AppendLine();

        foreach (var group in pullRequests.GroupBy(p => p.Labels[0]?.Name, (label, prs) => new { label, prs }))
        {
            releaseNotesBuilder.AppendLine($"## {group.label}");
            foreach (var pr in group.prs)
            {
            releaseNotesBuilder.AppendLine($"- #{pr.Number} {pr.Title}. Thanks @{pr.User.Login}");
            }
        }

        releaseNotes = releaseNotesBuilder.ToString();
            Serilog.Log.Information(releaseNotes);
        });

    Target Deploy => _ => _
    .OnlyWhenDynamic(() => GitRepository.ToString() == $"https://github.com/{organizationName}/{repositoryName}")
    .DependsOn(Compile)
    .DependsOn(GenerateReleaseNotes)
    .DependsOn(TagRelease)
    .DependsOn(Release)
    .Executes(() => {
      var npmrcFile = RootDirectory / ".npmrc";
      npmrcFile.WriteAllText($"//registry.npmjs.org/:_authToken={NpmToken}");
      var tag = GitRepository.IsOnMainOrMasterBranch() ? "latest" : "next";
      Npm($"publish --access public --tag {tag}");
    });

    Target Release => _ => _
    .OnlyWhenDynamic(() => GitRepository.IsOnMainOrMasterBranch() || GitRepository.IsOnReleaseBranch())
    .OnlyWhenDynamic(() => !string.IsNullOrWhiteSpace(GithubToken))
    .DependsOn(SetupGitHubClient)
    .DependsOn(GenerateReleaseNotes)
    .DependsOn(TagRelease)
    .DependsOn(Compile)
    .Executes(() =>
    {
      var newRelease = new NewRelease(GitRepository.IsOnMainOrMasterBranch() ? $"v{GitVersion.MajorMinorPatch}" : $"v{GitVersion.SemVer}")
      {
        Body = releaseNotes,
        Draft = true,
        Name = GitRepository.IsOnMainOrMasterBranch() ? $"v{GitVersion.MajorMinorPatch}" : $"v{GitVersion.SemVer}",
        TargetCommitish = GitVersion.Sha,
        Prerelease = GitRepository.IsOnReleaseBranch(),
      };
      release = gitHubClient.Repository.Release.Create(organizationName, repositoryName, newRelease).Result;
      Serilog.Log.Information($"{release.Name} released !");
    });
}
