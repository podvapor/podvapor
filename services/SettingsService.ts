import { eq } from "drizzle-orm";
import { db } from "../db/db.ts"
import { settings as settingsSchema } from "../db/schema.ts"

export class SettingsService {
  static async get(key: string) {
    let value = null

    const setting = await db.query.settings.findFirst({
      where: eq(settingsSchema.key, key)
    })

    if (setting) {
      if (setting.type == 'int') {
        value = parseInt(setting.value as string)
      } else {
        value = setting.value
      }
    }

    return value
  }

  static async set(key: string, value: string | number) {
    await db.update(settingsSchema).set({
      value: value as string
    }).where(eq(settingsSchema.key, key))
  }
}