import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createHarness, luaValue } from '@mriqbox/fivem-test-harness'

const resourceRoot = process.env.MRI_RESOURCE_ROOT
if (!resourceRoot) throw new Error('MRI_RESOURCE_ROOT is required')
const sources = ['shared/locale.lua'].map((file) => readFileSync(resolve(resourceRoot, file), 'utf8'))
const lua = await createHarness({ resourceName: 'qbx_core', sources })
const locale = await luaValue(lua, 'Locale ~= nil')
if (locale !== true) throw new Error('qbx_core locale source did not load')
console.log('qbx_core harness smoke passed')
