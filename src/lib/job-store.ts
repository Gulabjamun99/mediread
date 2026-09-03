// In-memory job store for background analysis tasks.
// Jobs are created by /api/analyze-start and polled by /api/analyze-status.
// This avoids long-lived HTTP connections (which the ALB kills after ~60-120s)
// by returning a job ID immediately and letting the client poll for status.

export type JobStatus = "processing" | "done" | "error";

export interface AnalysisJob {
  jobId: string;
  status: JobStatus;
  result?: unknown;
  error?: string;
  startedAt: number;
  finishedAt?: number;
}

// Global store — survives across requests within the same server process.
// Note: this is in-memory only; jobs are lost on server restart. That's
// acceptable for this use case (analyses take 1-3 min; users retry if needed).
const globalForJobs = globalThis as unknown as {
  __medireadJobs?: Map<string, AnalysisJob>;
};

export const jobStore: Map<string, AnalysisJob> =
  globalForJobs.__medireadJobs ?? new Map<string, AnalysisJob>();

if (!globalForJobs.__medireadJobs) {
  globalForJobs.__medireadJobs = jobStore;
}

// Clean up jobs older than 10 minutes to prevent memory leaks.
export function cleanupOldJobs(): void {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [id, job] of jobStore) {
    if (job.startedAt < tenMinutesAgo) {
      jobStore.delete(id);
    }
  }
}

export function createJob(jobId: string): AnalysisJob {
  cleanupOldJobs();
  const job: AnalysisJob = {
    jobId,
    status: "processing",
    startedAt: Date.now(),
  };
  jobStore.set(jobId, job);
  return job;
}

export function getJob(jobId: string): AnalysisJob | undefined {
  return jobStore.get(jobId);
}
