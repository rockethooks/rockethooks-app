import { subHours, subMinutes } from 'date-fns';
import { useState } from 'react';
import { loggers } from '@/utils';

const logger = loggers.ui;

import {
  APIConnectionCard,
  EventTimeline,
  JSONPathBuilder,
  Sparkline,
  TransformationEditor,
  type WebhookEvent,
  WebhookStatus,
} from './index';

/**
 * Demo/Examples for RocketHooks Custom Components
 *
 * This file showcases all custom components with realistic data
 * and demonstrates the various props and use cases.
 */

// Sample data for demonstrations
const sampleSparklineData = [
  200, 180, 220, 195, 210, 185, 205, 190, 215, 225, 240, 220, 205,
];

const sampleEvents: WebhookEvent[] = [
  {
    id: '1',
    timestamp: subMinutes(new Date(), 5),
    status: 'success',
    endpoint: '/api/users/profile',
    method: 'GET',
    responseTime: 145,
    statusCode: 200,
  },
  {
    id: '2',
    timestamp: subMinutes(new Date(), 15),
    status: 'failed',
    endpoint: '/api/orders/create',
    method: 'POST',
    responseTime: 3200,
    statusCode: 500,
    errorMessage: 'Internal server error: Database connection timeout',
  },
  {
    id: '3',
    timestamp: subMinutes(new Date(), 30),
    status: 'retrying',
    endpoint: '/api/notifications/send',
    method: 'POST',
    retryCount: 2,
    responseTime: 1200,
    statusCode: 429,
  },
  {
    id: '4',
    timestamp: subHours(new Date(), 2),
    status: 'success',
    endpoint: '/api/analytics/track',
    method: 'POST',
    responseTime: 95,
    statusCode: 201,
  },
];

const sampleJSONData = {
  user: {
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      preferences: {
        theme: 'dark',
        notifications: true,
      },
    },
  },
  data: {
    items: [
      { id: 1, name: 'Item 1', status: 'active' },
      { id: 2, name: 'Item 2', status: 'inactive' },
    ],
  },
  timestamp: 1634567890,
};

export function ComponentsDemo() {
  const [jsonPath, setJsonPath] = useState('$.user.profile.name');
  const [transformation, setTransformation] = useState(
    '{\n  "user_name": "$.user.profile.name",\n  "user_email": "$.user.profile.email",\n  "timestamp": "$.timestamp"\n}'
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">RocketHooks Custom Components</h1>
        <p className="text-muted-foreground">
          Demo showcasing all custom components built for webhook management and
          API monitoring.
        </p>
      </div>

      {/* WebhookStatus Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Webhook Status Indicators</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 border rounded-lg">
          <div className="space-y-2">
            <WebhookStatus status="success" showLabel />
          </div>
          <div className="space-y-2">
            <WebhookStatus status="pending" showLabel />
          </div>
          <div className="space-y-2">
            <WebhookStatus status="retrying" showLabel />
          </div>
          <div className="space-y-2">
            <WebhookStatus status="failed" showLabel />
          </div>
          <div className="space-y-2">
            <WebhookStatus status="circuit-open" showLabel />
          </div>
        </div>
      </section>

      {/* Sparkline Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Sparkline Charts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border rounded-lg">
          <div className="space-y-2">
            <h3 className="font-medium">Basic Sparkline</h3>
            <Sparkline data={sampleSparklineData} />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">With Gradient</h3>
            <Sparkline
              data={sampleSparklineData}
              gradient
              color="text-success"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Interactive</h3>
            <Sparkline
              data={sampleSparklineData}
              showTooltip
              width={120}
              height={30}
            />
          </div>
        </div>
      </section>

      {/* API Connection Card Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">API Connection Cards</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <APIConnectionCard
            name="User Profile API"
            endpoint="https://api.example.com/users/profile"
            method="GET"
            status="active"
            pollingInterval={30}
            lastChecked={new Date()}
            changesDetected={12}
            successRate={98.5}
            avgResponseTime={245}
            sparklineData={sampleSparklineData}
            onTest={() => {
              logger.debug('Test clicked');
            }}
            onEdit={() => {
              logger.debug('Edit clicked');
            }}
            onToggle={() => {
              logger.debug('Toggle clicked');
            }}
          />

          <APIConnectionCard
            name="Order Processing"
            endpoint="https://api.example.com/orders/webhook"
            method="POST"
            status="error"
            pollingInterval={60}
            lastChecked={subMinutes(new Date(), 5)}
            changesDetected={0}
            successRate={87.2}
            avgResponseTime={1250}
            onTest={() => {
              logger.debug('Test clicked');
            }}
            onEdit={() => {
              logger.debug('Edit clicked');
            }}
            onToggle={() => {
              logger.debug('Toggle clicked');
            }}
          />
        </div>
      </section>

      {/* JSONPath Builder */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">JSONPath Builder</h2>
        <div className="border rounded-lg p-6">
          <JSONPathBuilder
            value={jsonPath}
            onChange={setJsonPath}
            sampleData={sampleJSONData}
            onTest={() => {
              logger.debug('Testing JSONPath');
            }}
          />
        </div>
      </section>

      {/* Transformation Editor */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Transformation Editor</h2>
        <div className="border rounded-lg p-6">
          <TransformationEditor
            mode="code"
            value={transformation}
            onChange={setTransformation}
            inputSchema={sampleJSONData}
            outputPreview={{
              user_name: 'John Doe',
              user_email: 'john@example.com',
              timestamp: 1634567890,
            }}
          />
        </div>
      </section>

      {/* Event Timeline */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Event Timeline</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Compact View</h3>
            <div className="border rounded-lg p-6">
              <EventTimeline
                events={sampleEvents}
                view="compact"
                onEventClick={(event) => {
                  logger.debug('Event clicked:', event);
                }}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Detailed View</h3>
            <div className="border rounded-lg p-6">
              <EventTimeline
                events={sampleEvents}
                view="detailed"
                onEventClick={(event) => {
                  logger.debug('Event clicked:', event);
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ComponentsDemo;
