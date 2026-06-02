/** RUNTIME CLASSIFICATION: MOCK — Studio Admin demo; not in production navigation. */
import { users } from "./_components/data";
import { Users } from "./_components/users";

export default function Page() {
  return <Users users={users} />;
}
