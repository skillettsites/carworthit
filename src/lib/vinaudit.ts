// DEPRECATED: VinAudit's history API is B2B-only (no consumer resale), so the
// paid data layer moved to Vehicle Databases. Kept as a re-export shim so any
// lingering import keeps working. Use ./vehicledatabases directly.
export { getHistory } from './vehicledatabases';
