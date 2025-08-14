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

// TypeScript types for the mutation
export interface CreateOrganizationInput {
  name: string;
  domain?: string;
}

export interface Organization {
  id: string;
  name: string;
  domain?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrganizationResponse {
  createOrganization: Organization;
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
      errorPolicy: 'none', // Throw on any errors
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
 * Organization service namespace
 */
export const OrganizationService = {
  createOrganization,
} as const;
