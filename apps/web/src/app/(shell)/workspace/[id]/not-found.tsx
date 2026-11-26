import { Suspense } from 'react';
import { WorkspaceUnavailable } from './workspace-unavailable';

export default function WorkspaceNotFound() {
  return (
    <Suspense fallback={<WorkspaceUnavailable locale="en" />}>
      <WorkspaceUnavailable />
    </Suspense>
  );
}
