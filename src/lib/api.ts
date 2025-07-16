const BASE_URL = 'http://localhost:8080'; // Your backend base URL

export async function createMember(name: string, phone: string) {
    console.log(`Fetching from: "${BASE_URL}/members"`);
  const response = await fetch(`${BASE_URL}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, phone }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create member: ${response.statusText}`);
  }

  return await response.json();
}

export async function getAllMembers() {
  const response = await fetch(`${BASE_URL}/members`);
  return await response.json();
}
// DELETE /members/{id}
export async function deleteMember(id: number): Promise<void> {
  const response = await fetch(`http://localhost:8080/members/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete member');
  }
}
