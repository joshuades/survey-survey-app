import bcrypt from "bcrypt";

async function hashPassword(password) {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  const passwords = process.argv.slice(2);

  for (const password of passwords) {
    const hashedPassword = await hashPassword(password);
    console.log(`Original: ${password}, Hashed: ${hashedPassword}`);
  }
}

main().catch(console.error);
