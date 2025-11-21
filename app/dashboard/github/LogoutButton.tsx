'use client';

import { Button } from '@/components/ui';

export default function LogoutButton() {
  return (
    <a href="/auth/github/logout">
      <Button variant="danger" size="sm">
        Logout
      </Button>
    </a>
  );
}
