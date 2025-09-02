# Documentación de Tests

Este directorio contiene todos los tests del proyecto. Los tests están organizados en subdirectorios según su tipo:

- **Unit**: Tests unitarios para funciones específicas.
- **Integration**: Tests de integración para endpoints y flujos completos.
- **Security**: Tests de seguridad para autenticación, autorización y protección contra ataques.
- **Performance**: Tests de rendimiento para evaluar la capacidad de carga del sistema.

## Convenciones y Buenas Prácticas

1. Usar el estilo `expect` de Chai para escribir aserciones.
2. Organizar los tests en bloques descriptivos (`describe` e `it`).
3. Asegurarse de mockear dependencias externas en los tests unitarios.
4. Mantener los tests independientes entre sí.
5. Actualizar esta documentación siempre que agregues nuevos tests.