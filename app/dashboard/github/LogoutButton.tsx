'use client';

export default function LogoutButton() {
  return (
    <a
      href="/auth/github/logout"
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
    >
      Logout
    </a>
  );
}
