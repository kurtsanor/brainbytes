# BrainBytes Monitoring System Documentation

## 1. Dashboard Catalog

### Overview

The BrainBytes monitoring system uses Grafana dashboards integrated with Prometheus to provide real-time visibility into application performance, infrastructure health, user activity, and error monitoring. Each dashboard is designed for a specific monitoring purpose, allowing developers and administrators to quickly identify issues and evaluate overall system performance.

| Dashboard                                | Purpose                                                               | Key Metrics                                                                                                      | Target Audience                         | Primary Use Case                                                       |
| :--------------------------------------- | :-------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- | :-------------------------------------- | :--------------------------------------------------------------------- |
| **BrainBytes - System Overview**         | Displays the overall health and status of the application.            | Backend Status, Active Users, HTTP Requests, Request Rate, Error Requests, System Health Score, AI Response Time | Developers, DevOps, Project Managers    | Monitor overall system health and identify operational issues quickly. |
| **BrainBytes - Application Performance** | Tracks application responsiveness and request processing performance. | Request Rate, HTTP Requests, Average Response Time, AI Response Time, Error Rate                                 | Backend Developers, QA Engineers        | Analyze application performance and detect bottlenecks.                |
| **BrainBytes - Error Analysis**          | Provides insights into application errors and request failures.       | Error Rate, Requests by Status Code, Requests by Endpoint, Recent Errors, Error Trend Over Time                  | Developers, QA Engineers                | Troubleshoot errors and monitor failure patterns.                      |
| **BrainBytes - Resource Optimization**   | Monitors resource utilization and infrastructure efficiency.          | CPU Usage, Memory Usage, CPU vs Request Rate, Memory vs Active Users, Backend State Timeline                     | DevOps Engineers, System Administrators | Optimize resource allocation and monitor infrastructure health.        |
| **BrainBytes - User Experience**         | Monitors user-related metrics affecting the overall user experience.  | Active Users, Backend Status, Request Rate, HTTP Requests, AI Response Time                                      | Product Owners, Developers              | Evaluate user activity and identify issues impacting end users.        |

### Dashboard Screenshots

- **Figure 1.** BrainBytes – System Overview
- **Figure 2.** BrainBytes – Application Performance
- **Figure 3.** BrainBytes – Error Analysis
- **Figure 4.** BrainBytes – Resource Optimization
- **Figure 5.** BrainBytes – User Experience

---

## 2. Metric Dictionary

### Overview

The BrainBytes monitoring system collects application, infrastructure, and user activity metrics through Prometheus. These metrics are visualized in Grafana dashboards and are used to monitor application performance, system health, resource utilization, and user experience.

### Metric Dictionary

| Metric Name                                         | Description                                                      | How It's Calculated                                                                      | Normal Value Range           | Unusual Values Indicate                                                                             |
| :-------------------------------------------------- | :--------------------------------------------------------------- | :--------------------------------------------------------------------------------------- | :--------------------------- | :-------------------------------------------------------------------------------------------------- |
| `brainbytes_http_requests_total`                    | Total number of HTTP requests received by the application.       | Counter incremented for every incoming request.                                          | Continuously increasing      | Sudden spikes may indicate increased traffic or potential abuse; no increase may indicate downtime. |
| `brainbytes_active_users`                           | Number of users currently active in the application.             | Updated based on active user sessions.                                                   | Depends on application usage | A sudden drop may indicate authentication or connectivity issues.                                   |
| `brainbytes_ai_response_duration_seconds`           | Measures the duration of AI responses.                           | Histogram recording the response time of each AI request.                                | Typically below 2 seconds    | Higher values indicate slower AI responses or backend processing delays.                            |
| `brainbytes_ai_response_avg_seconds`                | Average AI response time calculated from recorded responses.     | Calculated using the total response duration divided by the total number of AI requests. | Less than 2 seconds          | Higher averages suggest degraded AI performance or increased workload.                              |
| `brainbytes_backend_memory_mb`                      | Memory currently used by the backend service.                    | Retrieved from the Node.js process memory usage.                                         | Stable based on workload     | Rapid increases may indicate memory leaks or excessive resource consumption.                        |
| `process_cpu_seconds_total`                         | Total CPU time consumed by the backend process.                  | Exported by Prometheus process metrics.                                                  | Gradual increase over time   | Sharp increases indicate high CPU utilization.                                                      |
| `process_resident_memory_bytes`                     | Resident memory currently allocated to the application process.  | Exported by Prometheus.                                                                  | Stable under normal workload | Significant growth may indicate memory leaks or inefficient resource usage.                         |
| `brainbytes_mobile_requests_total`                  | Number of requests originating from mobile devices.              | Counter incremented for mobile client requests.                                          | Depends on user activity     | Unexpected spikes may indicate increased mobile traffic.                                            |
| `brainbytes_estimated_data_usage_bytes_total`       | Estimated amount of network data transferred by the application. | Accumulated estimate of bytes processed.                                                 | Continuously increasing      | Large increases indicate higher bandwidth consumption.                                              |
| `brainbytes_intermittent_connectivity_events_total` | Number of detected intermittent connectivity events.             | Counter incremented whenever connectivity issues are detected.                           | Zero or very low             | Frequent increases indicate unstable network connectivity.                                          |
| `up`                                                | Indicates whether the monitored backend service is available.    | Prometheus health check.                                                                 | 1                            | A value of 0 indicates the monitored service is unavailable.                                        |

> **Notes:** During testing, some AI-related metrics displayed no recorded values because no AI response samples were generated within the selected monitoring period. The dashboards remain configured to display these metrics once AI telemetry becomes available.

---

## 3. Alert Reference Guide

### Overview

The BrainBytes monitoring system uses Prometheus and Grafana Alerting to continuously monitor the application's health, performance, and resource utilization. Alert rules notify administrators whenever predefined thresholds are exceeded, allowing issues to be identified and resolved before they significantly impact users.

### Severity Classification

| Severity          | Description                                                                                     | Expected Response Time |
| :---------------- | :---------------------------------------------------------------------------------------------- | :--------------------- |
| **Critical**      | Immediate action required because the application or a critical service may become unavailable. | Immediate              |
| **Warning**       | A potential issue has been detected that should be investigated before it escalates.            | Within 30 minutes      |
| **Informational** | General monitoring information that does not require immediate action.                          | As needed              |

### Configured Alert Rules

| Alert Name                       | Severity      | Threshold                                     | Evaluation Period | Possible Causes                                                          | Troubleshooting Steps / Resolution Procedure                                                                                                        |
| :------------------------------- | :------------ | :-------------------------------------------- | :---------------- | :----------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| **High Request Rate – Warning**  | Warning       | Request rate exceeds 0.15 requests/sec        | 5 minutes         | Increased user activity, traffic spikes, automated requests              | Review Grafana request graphs and identify affected endpoints. Continue monitoring or scale application resources if necessary.                     |
| **High Request Rate – Critical** | Critical      | Request rate exceeds 0.50 requests/sec        | 5 minutes         | Heavy traffic, denial-of-service attempts, abnormal workload             | Check backend performance, CPU usage, and request logs. Scale services, investigate unusual traffic, and mitigate abusive requests if necessary.    |
| **Backend Down**                 | Critical      | `up = 0`                                      | 1 minute          | Backend service stopped, application crash, server failure               | Verify backend service status and inspect application logs. Restart the backend service and confirm that Prometheus detects the service as healthy. |
| **High CPU Usage**               | Warning       | CPU usage exceeds configured threshold        | 5 minutes         | High processing load, inefficient application logic, increased traffic   | Review CPU utilization and identify resource-intensive processes. Optimize application performance or allocate additional CPU resources.            |
| **High Memory Usage**            | Warning       | Memory usage exceeds configured threshold     | 5 minutes         | Memory leaks, increased workload, excessive caching                      | Review memory utilization and application logs. Restart affected services if necessary and investigate memory consumption.                          |
| **AI Response Monitoring**       | Warning       | AI response time exceeds configured threshold | 5 minutes         | Slow AI processing, external AI service delays, increased request volume | Review AI response metrics and backend logs. Optimize AI processing or investigate external AI service performance.                                 |
| **Low User Activity**            | Informational | Active users fall below expected threshold    | 10 minutes        | Low platform usage, scheduled maintenance, connectivity issues           | Verify application availability and monitor user activity trends. No immediate action required unless accompanied by other alerts.                  |

### Alert Workflow

When an alert is triggered, the monitoring system follows the workflow below:

1. **Prometheus** continuously collects application metrics.
2. **Grafana** evaluates alert rules at configured intervals.
3. If a threshold is exceeded for the required evaluation period, the alert changes to the **Firing** state.
4. The alert is displayed in the **Grafana Alerting dashboard** and can be routed to configured notification channels.
5. Once the monitored metric returns to its normal range, the alert automatically resolves and returns to the **Normal** state.

> **Alert Monitoring Notes:** During development and testing, alerts were intentionally triggered to verify that Grafana correctly detected threshold violations and transitioned between Normal, Pending, and Firing states. This validation confirmed that the monitoring system responds appropriately to changes in application health and performance.

---

## 4. Monitoring Architecture Documentation

### 4.1 System Architecture Overview

The BrainBytes monitoring system integrates **Prometheus** and **Grafana** to provide real-time monitoring of the application's performance, health, and resource utilization. Prometheus collects metrics exposed by the BrainBytes backend, stores them in a time-series database, and Grafana visualizes the collected metrics through interactive dashboards and alerting mechanisms.

The monitoring architecture enables administrators and developers to observe system behavior, detect anomalies, and respond to performance issues before they affect end users.

### 4.2 Monitoring Architecture Diagram
