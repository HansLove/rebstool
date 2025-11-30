# Dead Code Detection Guide

Este proyecto incluye herramientas para detectar y eliminar código muerto (archivos, exports, dependencias no utilizadas).

## Comandos Disponibles

### Usando Knip (Recomendado)

Knip es una herramienta poderosa que detecta código muerto en proyectos TypeScript/JavaScript.

#### Comandos Básicos

```bash
# Analizar y mostrar código muerto
npm run deadcode

# Generar reporte en JSON
npm run deadcode:report

# Analizar solo archivos no utilizados
npm run deadcode:files

# Analizar solo dependencias no utilizadas
npm run deadcode:deps

# Analizar solo exports no utilizados
npm run deadcode:exports

# Analizar solo tipos no utilizados
npm run deadcode:types
```

#### Auto-fix (Cuidado)

```bash
# Intentar eliminar automáticamente archivos no utilizados
npm run deadcode:fix
```

⚠️ **Advertencia**: El comando `deadcode:fix` puede eliminar archivos. Asegúrate de tener un backup o commit antes de ejecutarlo.

### Script Personalizado

```bash
# Usar el script personalizado de análisis
npm run deadcode:custom
```

Este script realiza un análisis básico de archivos no utilizados basado en imports.

## Configuración

La configuración de Knip está en `knip.json`. Puedes ajustar:

- **entry**: Puntos de entrada de la aplicación
- **project**: Archivos a analizar
- **ignore**: Patrones a ignorar
- **ignoreDependencies**: Dependencias a ignorar en el análisis

## Uso Recomendado

1. **Primera vez**: Ejecuta `npm run deadcode` para ver qué se detecta
2. **Revisar**: Revisa cuidadosamente los resultados antes de eliminar
3. **Verificar falsos positivos**: Algunos archivos pueden aparecer como no usados pero ser necesarios:
   - Componentes de Vantage (se usan pero knip puede no detectarlos)
   - Archivos importados dinámicamente
   - Servicios usados por otros módulos
4. **Backup**: Haz commit o backup antes de eliminar archivos
5. **Eliminar manualmente**: Elimina archivos uno por uno verificando que no se usen
6. **Verificar**: Ejecuta `npm run build` y `npm run dev` para asegurar que todo funciona

## Archivos a Ignorar

El archivo `.knipignore` contiene una lista de archivos que knip debe ignorar aunque aparezcan como no utilizados. Estos incluyen:
- Componentes de Vantage que se usan pero knip no los detecta correctamente
- Servicios que pueden ser usados dinámicamente
- Componentes UI que pueden ser necesarios en el futuro

## Ejemplos de Salida

### Knip

El comando `npm run deadcode` mostrará algo como:

```
Unused files (69)
  src/components/OldComponent.tsx
  src/utils/unusedHelper.ts
  ...

Unused dependencies (12)
  @tanstack/react-table
  apexcharts
  ...

Unused exports (20)
  RUTE_USER_REGISTER  src/app/routes/routes.ts:3:14
  ...
```

**Nota**: Algunos archivos pueden aparecer como "no utilizados" pero ser necesarios:
- Componentes importados dinámicamente
- Archivos usados por rutas lazy-loaded
- Archivos referenciados en HTML/CSS
- Componentes de Vantage que se usan pero knip no los detecta correctamente

### Script Personalizado

```
🔍 Scanning for dead code...

📊 Analysis Results:

   Total files: 150
   Used files: 145
   Unused files: 5

❌ Potentially unused files:

   src/components/OldComponent.tsx
   src/utils/unusedHelper.ts
   ...
```

## Notas Importantes

1. **Falsos Positivos**: Algunos archivos pueden aparecer como no utilizados pero ser necesarios:
   - Archivos de configuración
   - Archivos importados dinámicamente
   - Archivos usados por herramientas de build
   - Archivos referenciados en HTML/CSS

2. **Archivos Dinámicos**: Los imports dinámicos (`import()`) pueden no ser detectados correctamente

3. **Revisar Manualmente**: Siempre revisa los resultados antes de eliminar archivos

4. **Testing**: Después de eliminar código, ejecuta tests y verifica que la aplicación funciona

## Integración con CI/CD

Puedes agregar dead code checking a tu pipeline:

```yaml
# .github/workflows/ci.yml
- name: Check for dead code
  run: npm run deadcode
```

## Troubleshooting

### Knip no detecta algunos archivos

- Verifica que los archivos estén en los patrones de `project` en `knip.json`
- Asegúrate de que los entry points estén correctamente configurados

### Falsos positivos

- Agrega archivos a la lista de `ignore` en `knip.json`
- Verifica si los archivos se usan dinámicamente

### Errores de TypeScript

- Ejecuta `npm run build` primero para verificar que no hay errores de tipos
- Algunos errores pueden ser causados por código muerto que necesita ser eliminado

