/**
 * GraphQL operations for Organization management
 */

import { gql } from '@apollo/client';
import { getCurrentApolloClient } from '@/lib/apollo';
import { loggers } from '@/utils';

const logger = loggers.api;

// GraphQL Mutation for creating an organization
const CREATE_ORGANIZATION_MUTATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      id
      name
      domain
      createdAt
      updatedAt
    }
  }
`;

// GraphQL Mutation for creating an organization with example monitors
const CREATE_ORGANIZATION_WITH_EXAMPLES_MUTATION = gql`
  mutation CreateOrganizationWithExamples($input: CreateOrganizationWithExamplesInput!) {
    createOrganizationWithExamples(input: $input) {
      organization {
        id
        name
        domain
        createdAt
        updatedAt
      }
      exampleMonitors {
        id
        name
        url
        method
        status
        createdAt
      }
    }
  }
`;

// TypeScript types for the mutation
export interface CreateOrganizationInput {
  name: string;
  domain?: string;
}

export interface CreateOrganizationWithExamplesInput {
  name: string;
  domain?: string;
  usageType: 'solo' | 'team';
}

export interface Organization {
  id: string;
  name: string;
  domain?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ExampleMonitor {
  id: string;
  name: string;
  url: string;
  method: string;
  status: string;
  createdAt: string;
}

export interface CreateOrganizationResponse {
  createOrganization: Organization;
}

export interface CreateOrganizationWithExamplesResponse {
  createOrganizationWithExamples: {
    organization: Organization;
    exampleMonitors: ExampleMonitor[];
  };
}

/**
 * Create a new organization using GraphQL mutation
 */
export async function createOrganization(
  input: CreateOrganizationInput
): Promise<Organization> {
  try {
    logger.debug('Creating organization', { organizationName: input.name });

    const client = getCurrentApolloClient();

    const { data } = await client.mutate<CreateOrganizationResponse>({
      mutation: CREATE_ORGANIZATION_MUTATION,
      variables: {
        input,
      },
      errorPolicy: 'all', // Handle partial errors gracefully
    });

    if (!data?.createOrganization) {
      throw new Error('No organization data returned from mutation');
    }

    const organization = data.createOrganization;

    logger.success('Organization created successfully', {
      organizationId: organization.id,
      organizationName: organization.name,
    });

    return organization;
  } catch (error) {
    logger.error('Failed to create organization', error);

    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`Failed to create organization: ${error.message}`);
    }

    throw new Error('Failed to create organization: Unknown error');
  }
}

/**
 * Create a new organization with example monitors using GraphQL mutation
 */
export async function createOrganizationWithExamples(
  input: CreateOrganizationWithExamplesInput
): Promise<{ organization: Organization; exampleMonitors: ExampleMonitor[] }> {
  try {
    logger.debug('Creating organization with examples', {
      organizationName: input.name,
      usageType: input.usageType,
    });

    const client = getCurrentApolloClient();

    const { data } =
      await client.mutate<CreateOrganizationWithExamplesResponse>({
        mutation: CREATE_ORGANIZATION_WITH_EXAMPLES_MUTATION,
        variables: {
          input,
        },
        errorPolicy: 'all', // Handle partial errors gracefully
      });

    if (!data?.createOrganizationWithExamples) {
      throw new Error('No organization data returned from mutation');
    }

    const { organization, exampleMonitors } =
      data.createOrganizationWithExamples;

    logger.success('Organization with examples created successfully', {
      organizationId: organization.id,
      organizationName: organization.name,
      exampleMonitorsCount: exampleMonitors.length,
    });

    return { organization, exampleMonitors };
  } catch (error) {
    logger.error('Failed to create organization with examples', error);

    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(
        `Failed to create organization with examples: ${error.message}`
      );
    }

    throw new Error(
      'Failed to create organization with examples: Unknown error'
    );
  }
}

/**
 * Organization service namespace
 */
export const OrganizationService = {
  createOrganization,
  createOrganizationWithExamples,
} as const;
