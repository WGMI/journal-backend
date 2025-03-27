🧩 Data Model Design
✅ Database Used: MySQL
This journaling app uses MySQL via Prisma ORM for structured, relational data. PostgreSQL is also fully supported with minor adjustments.

📘 Overview
The data model includes three core entities:

User – represents an individual account

Entry – stores journal content

Category – allows entries to be grouped and filtered

🧑‍💻 User Model

model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  password String
  name     String
  entries  Entry[]
  categories Category[]
}

email is unique to prevent duplicate accounts.

Stores hashed passwords (authentication handled securely).

Linked to both entries and categories via one-to-many relationships.

📓 Entry Model

model Entry {
  id         Int      @id @default(autoincrement())
  title      String
  content    String
  date       DateTime
  user       User     @relation(fields: [userId], references: [id])
  userId     Int
  category   Category @relation(fields: [categoryId], references: [id])
  categoryId Int
}

Each entry has a date field to support analytics and time-based visualizations (e.g., heatmaps).

Linked to User (ownership) and Category (for filtering/stats).

🗂️ Category Model

model Category {
  id       Int     @id @default(autoincrement())
  name     String
  user     User    @relation(fields: [userId], references: [id])
  userId   Int
  entries  Entry[]
}

Categories are user-specific — no global/shared categories.

Enables personal organization of entries and per-user stats.

Categories can contain multiple entries.

🔗 Relationships
Entity 1	Entity 2	Type	        Description
User	    Entry	    One-to-many	    Each user can create many entries
User	    Category	One-to-many	    Each user defines their own categories
Entry	    Category	Many-to-one	    Each entry belongs to a category

