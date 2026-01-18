/**
 * GitHub API client for fetching user data
 */

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  private: boolean;
  updatedAt: string;
}

export interface Commit {
  sha: string;
  message: string;
  date: string;
  author: string;
}

export interface DateRange {
  since?: string; // ISO 8601 date string
  until?: string; // ISO 8601 date string
}

interface GitHubRepoResponse {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  updated_at: string;
}

interface GitHubCommitResponse {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

/**
 * Fetches user's repositories from the GitHub API
 * @param accessToken - OAuth access token from the user's session
 * @returns Array of repositories or empty array on error
 */
export async function getRepositories(
  accessToken: string
): Promise<Repository[]> {
  try {
    const repos: Repository[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const response = await fetch(
        `https://api.github.com/user/repos?per_page=${perPage}&page=${page}&sort=updated`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      if (!response.ok) {
        console.error(
          `GitHub API error: ${response.status} ${response.statusText}`
        );
        return [];
      }

      const data: GitHubRepoResponse[] = await response.json();

      if (data.length === 0) {
        break;
      }

      repos.push(
        ...data.map((repo) => ({
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          private: repo.private,
          updatedAt: repo.updated_at,
        }))
      );

      // If we got fewer than perPage, we've reached the last page
      if (data.length < perPage) {
        break;
      }

      page++;
    }

    return repos;
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return [];
  }
}

/**
 * Fetches commits from a repository
 * @param accessToken - OAuth access token from the user's session
 * @param repoFullName - Full repository name (e.g., "owner/repo")
 * @param dateRange - Optional date range to filter commits
 * @returns Array of commits or empty array on error
 */
export async function getCommits(
  accessToken: string,
  repoFullName: string,
  dateRange?: DateRange
): Promise<Commit[]> {
  try {
    const commits: Commit[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      // Build URL with query parameters
      const params = new URLSearchParams({
        per_page: perPage.toString(),
        page: page.toString(),
      });

      if (dateRange?.since) {
        params.set("since", dateRange.since);
      }
      if (dateRange?.until) {
        params.set("until", dateRange.until);
      }

      const response = await fetch(
        `https://api.github.com/repos/${repoFullName}/commits?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      if (!response.ok) {
        console.error(
          `GitHub API error fetching commits: ${response.status} ${response.statusText}`
        );
        return [];
      }

      const data: GitHubCommitResponse[] = await response.json();

      if (data.length === 0) {
        break;
      }

      commits.push(
        ...data.map((commit) => ({
          sha: commit.sha,
          message: commit.commit.message,
          date: commit.commit.author.date,
          author: commit.commit.author.name,
        }))
      );

      // If we got fewer than perPage, we've reached the last page
      if (data.length < perPage) {
        break;
      }

      page++;
    }

    return commits;
  } catch (error) {
    console.error("Error fetching commits:", error);
    return [];
  }
}
