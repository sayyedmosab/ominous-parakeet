import { supabaseClient } from './supabaseClient';
import sampleData from '../sampleData';
import type { CapabilityData } from '../components/types';

/*
 * fetchCapabilityData returns hierarchical capability data for use in the
 * heatmap.  When a Supabase client is available it will call the
 * `get_capability_health` RPC to retrieve live data for the given year.
 * Otherwise it falls back to a locally defined sample.  The shape of
 * the returned structure matches the CapabilityData type used by
 * the heatmap components.
 */
export async function fetchCapabilityData(year: number = 2025): Promise<CapabilityData> {
  if (supabaseClient) {
    // Call the edge function (RPC) in Supabase.  The RPC is expected
    // to return an array of capabilities, each with nested children
    // representing L1/L2/L3.  If the RPC is not present or returns an
    // error the catch block will be triggered and sample data will
    // be returned.
    try {
      const { data, error } = await supabaseClient.rpc('get_capability_health', { p_year: year });
      if (error) {
        throw new Error(error.message || 'Unknown Supabase error');
      }
      if (!data || !Array.isArray(data)) {
        throw new Error('Unexpected response from Supabase');
      }
      // Transform the Supabase response into the CapabilityData shape.
      return data.map((l1: any) => transformApiNode(l1));
    } catch (e) {
      console.warn('Falling back to sample data due to Supabase error:', e);
      return sampleData;
    }
  }
  // When no Supabase client is configured simply return the sample data.
  return sampleData;
}

// Recursively convert the RPC response into the CapabilityData format.
function transformApiNode(apiNode: any): any {
  const status = mapCategoryToStatus(apiNode.capability_health_category);
  const attributes = {
    // Preserve any numeric overlay attributes present on the API
    // node.  If the node does not include additional attributes
    // assign zero as a default.  These keys match the IDs defined
    // in config.json.
    staffNeeds: apiNode.staff_needs || 0,
    itTools: apiNode.it_tools || 0,
    processDocumentation: apiNode.process_documentation || 0,
    teamHealth: apiNode.total_health_score || 0,
    resistanceLevel: apiNode.resistance_level || 0,
    budgetAllocated: apiNode.budget_allocated || 0,
    highRisks: apiNode.high_risks || 0,
  };

  const children = Array.isArray(apiNode.children) ? apiNode.children : [];
  return {
    id: apiNode.capability_id,
    name: apiNode.capability_name,
    status,
    attributes,
    l2Capabilities: children.map((l2: any) => {
      const l2Status = mapCategoryToStatus(l2.capability_health_category);
      const l2Attributes = {
        staffNeeds: l2.staff_needs || 0,
        itTools: l2.it_tools || 0,
        processDocumentation: l2.process_documentation || 0,
        teamHealth: l2.total_health_score || 0,
        resistanceLevel: l2.resistance_level || 0,
        budgetAllocated: l2.budget_allocated || 0,
        highRisks: l2.high_risks || 0,
      };
      const l3Children = Array.isArray(l2.children) ? l2.children : [];
      return {
        id: l2.capability_id,
        name: l2.capability_name,
        status: l2Status,
        attributes: l2Attributes,
        l3Capabilities: l3Children.map((l3: any) => {
          const l3Status = mapCategoryToStatus(l3.capability_health_category);
          const l3Attributes = {
            staffNeeds: l3.staff_needs || 0,
            itTools: l3.it_tools || 0,
            processDocumentation: l3.process_documentation || 0,
            teamHealth: l3.total_health_score || 0,
            resistanceLevel: l3.resistance_level || 0,
            budgetAllocated: l3.budget_allocated || 0,
            highRisks: l3.high_risks || 0,
          };
          return {
            id: l3.capability_id,
            name: l3.capability_name,
            status: l3Status,
            attributes: l3Attributes,
          };
        }),
      };
    }),
  };
}

// Map a health category string returned by Supabase into a RAG
// status understood by the heatmap.  Any unrecognised value will
// default to Red.
function mapCategoryToStatus(category: string | null | undefined): 'Green' | 'Amber' | 'Red' {
  if (!category) return 'Red';
  const lower = category.toLowerCase();
  if (lower === 'excellent' || lower === 'good') return 'Green';
  if (lower === 'at risk') return 'Amber';
  return 'Red';
}