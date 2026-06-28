# BrainBytes AI Tutoring Platform

# Monitoring System Documentation

This document describes the monitoring implementation for the **BrainBytes AI Tutoring Platform** using **Prometheus**. The monitoring solution collects both application and system metrics from the backend service, providing real-time visibility into application health, request traffic, resource utilization, and custom business metrics.

The monitoring environment is fully containerized using Docker Compose and integrates directly with the Express backend through a `/metrics` endpoint.

---

# Table of Contents

- [Introduction](#introduction)
- [Monitoring Objectives](#monitoring-objectives)
- [Monitoring Architecture](#monitoring-architecture)
- [System Components](#system-components)
- [Data Flow](#data-flow)
- [Metrics Catalog](#metrics-catalog)
- [PromQL Query Reference](#promql-query-reference)
- [Alert Rules](#alert-rules)
- [Recording Rules](#recording-rules)
- [Traffic Simulation](#traffic-simulation)
- [Filipino Context Monitoring](#filipino-context-monitoring)
- [Configuration Files](#configuration-files)
- [Deployment Architecture](#deployment-architecture)
- [Screenshots](#screenshots)
- [Challenges Encountered](#challenges-encountered)
- [Future Improvements](#future-improvements)
- [Conclusion](#conclusion)

---

# Introduction

BrainBytes uses Prometheus to continuously monitor backend performance, resource utilization, and application-specific metrics. The monitoring system enables developers to observe the health of the platform, identify performance bottlenecks, and troubleshoot issues before they affect users.

---

# Monitoring Objectives

The monitoring implementation aims to:

- Monitor application health in real time.
- Track incoming HTTP requests.
- Measure AI response performance.
- Monitor active users.
- Collect BrainBytes-specific business metrics.
- Simulate realistic application traffic.
- Support future dashboards and alerting.
- Improve troubleshooting and operational visibility.

---

# Monitoring Architecture

## Architecture Diagram

> _(Insert monitoring architecture diagram here.)_

Example flow:

```
Users
   │
   ▼
Frontend
   │
   ▼
Backend (Express)
   │
   ├── Custom Metrics
   ├── HTTP Metrics
   └── /metrics endpoint
            │
            ▼
      Prometheus Server
            │
      Recording Rules
            │
        Alert Rules
```

---

# System Components

| Component         | Purpose                                           |
| ----------------- | ------------------------------------------------- |
| Frontend          | Provides the BrainBytes user interface            |
| Backend           | Processes requests and exposes Prometheus metrics |
| MongoDB           | Stores application data                           |
| Prometheus        | Collects and stores time-series metrics           |
| Docker Compose    | Manages the monitoring environment                |
| Traffic Simulator | Generates simulated user traffic for testing      |

---

# Data Flow

The monitoring workflow follows these steps:

1. Users interact with BrainBytes.
2. Requests are processed by the Express backend.
3. Monitoring middleware records request statistics.
4. Custom application metrics are updated.
5. Prometheus periodically scrapes the `/metrics` endpoint.
6. Metrics are stored as time-series data.
7. Developers query metrics using PromQL for monitoring and troubleshooting.

---

# Metrics Catalog

## Application Metrics

| Metric                                    | Type      | Description                      |
| ----------------------------------------- | --------- | -------------------------------- |
| `brainbytes_http_requests_total`          | Counter   | Counts all backend HTTP requests |
| `brainbytes_active_users`                 | Gauge     | Tracks currently active users    |
| `brainbytes_ai_response_duration_seconds` | Histogram | Measures AI response duration    |

## Filipino-Specific Metrics

| Metric                                              | Type    | Description                                 |
| --------------------------------------------------- | ------- | ------------------------------------------- |
| `brainbytes_mobile_requests_total`                  | Counter | Counts requests coming from mobile devices  |
| `brainbytes_estimated_data_usage_bytes_total`       | Counter | Estimates bandwidth consumption             |
| `brainbytes_intermittent_connectivity_events_total` | Counter | Tracks simulated connectivity interruptions |

---

# PromQL Query Reference

| Query                                                                                | Description                      |
| ------------------------------------------------------------------------------------ | -------------------------------- |
| `brainbytes_http_requests_total`                                                     | Total HTTP requests              |
| `rate(brainbytes_http_requests_total[5m])`                                           | Requests per second              |
| `brainbytes_active_users`                                                            | Current active users             |
| `brainbytes_mobile_requests_total`                                                   | Mobile requests                  |
| `brainbytes_estimated_data_usage_bytes_total`                                        | Estimated bandwidth usage        |
| `process_resident_memory_bytes`                                                      | Backend memory usage             |
| `process_cpu_seconds_total`                                                          | CPU usage                        |
| `nodejs_eventloop_lag_seconds`                                                       | Event loop latency               |
| `histogram_quantile(0.95, rate(brainbytes_ai_response_duration_seconds_bucket[5m]))` | 95th percentile AI response time |
| `up`                                                                                 | Service availability             |

---

# Alert Rules

| Alert             | Trigger                            | Purpose                           |
| ----------------- | ---------------------------------- | --------------------------------- |
| Backend Down      | `up == 0`                          | Detect backend service failure    |
| High CPU Usage    | CPU exceeds threshold              | Detect excessive CPU utilization  |
| High Memory Usage | Memory exceeds threshold           | Prevent resource exhaustion       |
| High Error Rate   | Excessive HTTP 5xx responses       | Detect backend failures           |
| Slow AI Response  | Response latency exceeds threshold | Detect AI performance degradation |

## Response Procedure

- Verify the affected container is running.
- Inspect Docker logs for errors.
- Confirm Prometheus scrape targets are healthy.
- Restart affected services if necessary.
- Investigate application logs for root cause analysis.

---

# Recording Rules

Recording rules precompute frequently used PromQL expressions to improve dashboard performance and reduce query execution time.

Examples include:

- Request rate over the last five minutes.
- Average AI response time.

These rules are defined in:

```
prometheus/recording_rules.yml
```

---

# Traffic Simulation

To evaluate monitoring functionality, a traffic simulator was developed.

## Scenarios

### Normal Traffic

Simulates regular user interactions with the application.

### Mobile Traffic

Generates requests using mobile User-Agent headers to validate mobile-specific metrics.

### Error Scenario

Sends requests to invalid endpoints to generate HTTP 404 responses for testing alerts and error monitoring.

Run the simulator using:

```bash
node simulate-traffic.mjs
```

---

# Filipino Context Monitoring

BrainBytes includes monitoring metrics tailored to the connectivity conditions commonly experienced by users in the Philippines.

These include:

- Mobile device usage
- Estimated bandwidth consumption
- Intermittent connectivity events

These metrics provide better visibility into user experience under mobile-first usage patterns and unstable internet connections.

## Cloud Cost Optimization

To reduce monitoring overhead:

- Appropriate scrape intervals are configured.
- Recording rules reduce expensive PromQL queries.
- Only required metrics are collected.
- Containers share the existing Docker network.

---

# Configuration Files

The monitoring implementation consists of the following configuration files:

```
docker-compose.yml
prometheus/
├── prometheus.yml
├── alert_rules.yml
└── recording_rules.yml

simulate-traffic.mjs
```

---

# Deployment Architecture

The monitoring environment is fully containerized using Docker Compose.

Containers include:

- Frontend
- Backend
- MongoDB
- Prometheus

Prometheus continuously scrapes the backend `/metrics` endpoint and stores collected metrics for querying and analysis.

---

# Screenshots

Include screenshots demonstrating:

- Prometheus Targets page
- Prometheus Graph page
- Loaded Recording Rules
- Active Alert Rules
- Metrics endpoint
- Running Docker containers

---

# Challenges Encountered

Several implementation challenges were encountered during development, including:

- Missing OAuth environment variables.
- Docker container startup failures.
- Prometheus scrape configuration issues.
- Metrics registration conflicts.
- Docker networking configuration.

These issues were resolved by validating environment variables, rebuilding containers, correcting Prometheus configuration files, and verifying scrape targets.

---

# Future Improvements

Potential future enhancements include:

- Grafana dashboards
- Alertmanager integration
- Kubernetes deployment
- Distributed tracing
- Business analytics dashboards
- Real-time notifications
- Long-term metric storage
- Automated anomaly detection

---

# Conclusion

The BrainBytes monitoring implementation successfully integrates Prometheus into the backend application, providing real-time visibility into application health, resource utilization, and performance. Through custom metrics, traffic simulation, recording rules, alerting, and Filipino-specific monitoring considerations, the platform establishes a scalable foundation for future observability and production deployment.
