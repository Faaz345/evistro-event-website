# Event Auto-Complete Feature

This feature automatically marks events as completed when their end time has passed. This document explains how the feature works and how to set it up.

## Database Changes

The feature adds the following fields to the `event_tracking` table:
- `start_time`: The time when the event starts
- `end_time`: The time when the event ends

It also adds a new status value `completed` to the existing `status` field (which previously only had `upcoming` and `cancelled`).

## How It Works

1. **Database Triggers**: A PostgreSQL trigger function checks if an event's date and time have passed whenever an event is created or updated, and automatically marks it as completed if necessary.

2. **Scheduled Function**: A function is provided to periodically check all events and mark them as completed if their end time has passed.

3. **Client-Side Checks**: The application also performs client-side checks to update the UI immediately when an event is completed, without waiting for the server.

## Setup Instructions

### 1. Apply Database Changes

Run the SQL script to add the necessary database changes:

```bash
node src/lib/apply_event_auto_complete.js
```

This will:
- Add `start_time` and `end_time` columns to the `event_tracking` table
- Add the `completed` status option
- Create the trigger function to automatically mark events as completed
- Create a function to check for completed events

### 2. Testing the Feature

To test the feature:
1. Create a new event with a date and time
2. Set the end time to a few minutes in the future
3. Wait until the end time passes
4. Refresh the dashboard or events page
5. The event should be automatically marked as completed

## Components Updated

The following components were updated or created for this feature:

1. **Database**:
   - Added `start_time` and `end_time` fields to `event_tracking` table
   - Created trigger function for auto-completion
   - Added RPC function for manual checking

2. **Types**:
   - Updated `EventTracking` type to include time fields
   - Added `completed` status

3. **Components**:
   - Updated `UpcomingEvents` to display event times
   - Updated `Events` admin page to show event times and completion status
   - Created `CreateEvent` page with time fields
   - Created `EditEvent` page with time fields

4. **Utilities**:
   - Added `eventStatus.ts` with helper functions

## Manual Event Status Management

Administrators can still manually change event status using the Edit Event page, which provides buttons to mark events as:
- Upcoming
- Completed
- Cancelled

## Future Improvements

Possible future improvements include:
- Email notifications when an event is automatically completed
- Integration with calendar systems
- Reminder notifications before event start/end times
- Automatic post-event surveys when an event is completed 