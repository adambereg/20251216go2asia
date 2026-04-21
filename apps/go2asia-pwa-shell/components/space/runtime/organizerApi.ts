import { customInstance } from '@go2asia/sdk';

export type OrganizerApiError = {
  status?: number;
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
};

export type OrganizerTripStatus = 'draft' | 'active' | 'completed' | 'archived';
export type OrganizerTripItemStatus = 'planned' | 'booked' | 'done';
export type OrganizerTripTaskStatus = 'pending' | 'done';
export type OrganizerTripDatesConfidence = 'none' | 'rough' | 'confirmed';
export type OrganizerTripLifecycleMode = 'preparation' | 'in_trip' | 'post_trip';

export type OrganizerTripSummary = {
  id: string;
  title: string;
  destinationLabel: string | null;
  summary: string | null;
  status: OrganizerTripStatus;
  startDate: string | null;
  endDate: string | null;
  datesConfidence: OrganizerTripDatesConfidence | null;
  lifecycleOverride: OrganizerTripLifecycleMode | null;
  createdAt: string | null;
  updatedAt: string | null;
  itemCount: number;
  bookedItemCount: number;
  pinnedItemCount: number;
  linkedItemCount: number;
  pendingTaskCount: number;
  firstPendingTaskTitle: string | null;
  noteCount: number;
  dayCount: number;
};

export type OrganizerTrip = {
  id: string;
  title: string;
  destinationLabel: string | null;
  summary: string | null;
  status: OrganizerTripStatus;
  startDate: string | null;
  endDate: string | null;
  datesConfidence: OrganizerTripDatesConfidence | null;
  lifecycleOverride: OrganizerTripLifecycleMode | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type OrganizerTripItem = {
  id: string;
  tripId: string;
  title: string;
  note: string | null;
  category: string | null;
  pinned: boolean;
  dayDate: string | null;
  status: OrganizerTripItemStatus;
  sourceModule: string | null;
  sourceEntityType: string | null;
  sourceEntityId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type OrganizerTripTask = {
  id: string;
  tripId: string;
  title: string;
  status: OrganizerTripTaskStatus;
  dayDate: string | null;
  sortOrder: number;
  whyItMatters: string | null;
  completedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type OrganizerTripNote = {
  id: string;
  tripId: string;
  body: string;
  dayDate: string | null;
  noteType: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type OrganizerTripDay = {
  id: string;
  tripId: string;
  dayDate: string;
  theme: string | null;
  focus: string | null;
  plannedHighlights: string | null;
  sortOrder: number;
  createdAt: string | null;
  updatedAt: string | null;
};

export type OrganizerTripItemNote = {
  id: string;
  itemId: string;
  tripId: string;
  body: string;
  sortOrder: number;
  createdAt: string | null;
  updatedAt: string | null;
};

export type OrganizerTripListResponse = {
  trips: OrganizerTripSummary[];
};

export type OrganizerTripDetailResponse = {
  trip: OrganizerTrip;
  items: OrganizerTripItem[];
  tasks: OrganizerTripTask[];
  notes: OrganizerTripNote[];
  days: OrganizerTripDay[];
  itemNotes: OrganizerTripItemNote[];
  insight?: {
    whatMattersNow?: string;
  };
};

type CreateTripPayload = {
  title: string;
  destinationLabel?: string | null;
  summary?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  datesConfidence?: OrganizerTripDatesConfidence | null;
  lifecycleOverride?: OrganizerTripLifecycleMode | null;
};

type UpdateTripPayload = {
  title?: string | null;
  destinationLabel?: string | null;
  summary?: string | null;
  status?: OrganizerTripStatus;
  startDate?: string | null;
  endDate?: string | null;
  datesConfidence?: OrganizerTripDatesConfidence | null;
  lifecycleOverride?: OrganizerTripLifecycleMode | null;
};

type CreateItemPayload = {
  title: string;
  note?: string | null;
  category?: string | null;
  pinned?: boolean;
  dayDate?: string | null;
  status?: OrganizerTripItemStatus;
  source?: {
    module: string;
    entityType: string;
    entityId: string;
  };
};

type CreateTaskPayload = {
  title: string;
  status?: OrganizerTripTaskStatus;
  dayDate?: string | null;
  sortOrder?: number;
  whyItMatters?: string | null;
};

type UpdateTaskPayload = {
  status?: OrganizerTripTaskStatus;
  dayDate?: string | null;
  sortOrder?: number | null;
  whyItMatters?: string | null;
};

type CreateNotePayload = {
  body: string;
  dayDate?: string | null;
  noteType?: string | null;
};

type OrganizerFetchConfig = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  [key: string]: unknown;
};

async function safeRequest<T>(
  init: OrganizerFetchConfig,
  path: string
): Promise<{ data: T | null; error: OrganizerApiError | null }> {
  try {
    const data = await customInstance<T>(init, path);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as OrganizerApiError };
  }
}

export function fetchOrganizerTrips() {
  return safeRequest<OrganizerTripListResponse>({ method: 'GET' }, '/v1/organizer/trips');
}

export function createOrganizerTrip(payload: CreateTripPayload) {
  return safeRequest<{ trip: OrganizerTrip }>(
    { method: 'POST', body: JSON.stringify(payload) },
    '/v1/organizer/trips'
  );
}

export function fetchOrganizerTripDetail(tripId: string) {
  return safeRequest<OrganizerTripDetailResponse>({ method: 'GET' }, `/v1/organizer/trips/${encodeURIComponent(tripId)}`);
}

export function updateOrganizerTrip(tripId: string, payload: UpdateTripPayload) {
  return safeRequest<{ trip: OrganizerTrip }>(
    { method: 'PATCH', body: JSON.stringify(payload) },
    `/v1/organizer/trips/${encodeURIComponent(tripId)}`
  );
}

export function createOrganizerTripItem(tripId: string, payload: CreateItemPayload) {
  return safeRequest<{ item: OrganizerTripItem; applied?: boolean }>(
    { method: 'POST', body: JSON.stringify(payload) },
    `/v1/organizer/trips/${encodeURIComponent(tripId)}/items`
  );
}

export function deleteOrganizerTripItem(tripId: string, itemId: string) {
  return safeRequest<{ removed: boolean; tripId: string; itemId: string }>(
    { method: 'DELETE' },
    `/v1/organizer/trips/${encodeURIComponent(tripId)}/items/${encodeURIComponent(itemId)}`
  );
}

export function updateOrganizerTripItem(
  tripId: string,
  itemId: string,
  payload: {
    title?: string | null;
    note?: string | null;
    category?: string | null;
    pinned?: boolean;
    dayDate?: string | null;
    status?: OrganizerTripItemStatus;
  }
) {
  return safeRequest<{ item: OrganizerTripItem }>(
    { method: 'PATCH', body: JSON.stringify(payload) },
    `/v1/organizer/trips/${encodeURIComponent(tripId)}/items/${encodeURIComponent(itemId)}`
  );
}

export function createOrganizerTripTask(tripId: string, payload: CreateTaskPayload) {
  return safeRequest<{ task: OrganizerTripTask }>(
    { method: 'POST', body: JSON.stringify(payload) },
    `/v1/organizer/trips/${encodeURIComponent(tripId)}/tasks`
  );
}

export function updateOrganizerTripTask(tripId: string, taskId: string, payload: UpdateTaskPayload) {
  return safeRequest<{ task: OrganizerTripTask }>(
    { method: 'PATCH', body: JSON.stringify(payload) },
    `/v1/organizer/trips/${encodeURIComponent(tripId)}/tasks/${encodeURIComponent(taskId)}`
  );
}

export function createOrganizerTripNote(tripId: string, payload: CreateNotePayload) {
  return safeRequest<{ note: OrganizerTripNote }>(
    { method: 'POST', body: JSON.stringify(payload) },
    `/v1/organizer/trips/${encodeURIComponent(tripId)}/notes`
  );
}

export function createOrganizerTripItemNote(
  tripId: string,
  itemId: string,
  payload: {
    body: string;
    sortOrder?: number;
  }
) {
  return safeRequest<{ itemNote: OrganizerTripItemNote }>(
    { method: 'POST', body: JSON.stringify(payload) },
    `/v1/organizer/trips/${encodeURIComponent(tripId)}/items/${encodeURIComponent(itemId)}/notes`
  );
}
