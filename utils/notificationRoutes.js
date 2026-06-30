const notificationRoutes = {
  applicationStatus: (notification) =>
    `/applications/${notification.applicationId}`,

  jobApplication: (notification) =>
    `/recruiter/job/${notification.jobId}/applicants`,

  recruiterApproved: () => "/recruiter/dashboard",

  recruiterRejected: () => "/recruiter/pending",

  jobApproved: (notification) => `/job/${notification.jobId}`,

  jobRejected: () => "/recruiter/jobs",

  message: (notification) => `/messages/${notification.metadata.chatId}`,
};

module.exports = notificationRoutes;