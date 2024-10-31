// import "@/lib/config";
// import { eq } from 'drizzle-orm'
// import { db } from ".";
// import { huntersTable } from "./schema";

async function main() {
  // const hunter: typeof huntersTable.$inferInsert = {
  //   name: "Gon",
  //   email: "gon@example.com",
  // };
  // await db.insert(huntersTable).values(hunter);
  // console.log("New hunter created!");
  // const hunters = await db.select().from(huntersTable);
  // console.log("Getting all hunters from the database: ", hunters);
  //   await db
  //     .update(huntersTable)
  //     .set({
  //       name: "Freecs",
  //     })
  //     .where(eq(huntersTable.email, hunter.email));
  //   console.log('Hunter info updated!')
  //   await db.delete(huntersTable).where(eq(huntersTable.email, hunter.email));
  //   console.log('Hunter deleted!')
}

main();
