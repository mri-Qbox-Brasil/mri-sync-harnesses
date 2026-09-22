import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createHarness, luaValue } from '@mriqbox/fivem-test-harness'

const resourceRoot = process.env.MRI_RESOURCE_ROOT
if (!resourceRoot) throw new Error('MRI_RESOURCE_ROOT is required')
const sources = ['shared/locale.lua'].map((file) => readFileSync(resolve(resourceRoot, file), 'utf8'))
const lua = await createHarness({ resourceName: 'qbx_core', sources })
if (await luaValue(lua, 'Locale ~= nil') !== true) throw new Error('Locale global missing')
await lua.doString("testLocale = Locale.new(nil, { warnOnMissing = false, phrases = { greeting = 'Hello %{name}' } })")
if (await luaValue(lua, "testLocale:t('greeting', { name = 'MRI' })") !== 'Hello MRI') {
    throw new Error('Locale substitution contract failed')
}
console.log('qbx_core harness smoke passed: Locale load and substitution')
