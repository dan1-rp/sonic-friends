6. Preguntas para la bitácora de decisiones

1. ¿Por qué usar un id único en lugar de identificar al personaje por su nombre? ¿Qué pasaría si dos personajes se llaman igual?
Usar un id único permite identificar a cada personaje sin confundirlo con los demás. Si dos personajes tuvieran el mismo nombre, el id ayudaría a editar o eliminar al correcto. Otra opción sería usar el nombre, pero podría causar errores si existen nombres repetidos.

2. ¿Conviene guardar todo el arreglo en una sola clave de localStorage o un personaje por clave?
Considero que es mejor guardar todos los personajes en un solo arreglo, porque así es más fácil cargar, buscar, editar y eliminar información. La desventaja es que se debe actualizar el arreglo completo cada vez que hay un cambio. Guardar cada personaje en una clave diferente permitiría modificarlo por separado, pero haría más complicado organizar los datos.

4. ¿Qué ocurre si alguien modifica manualmente localStorage desde la consola y deja un JSON inválido?
Si el JSON está dañado, la aplicación podría dejar de cargar los personajes correctamente. Para evitarlo, se puede utilizar try...catch al leer los datos y comprobar que tengan el formato esperado. En mi proyecto ya se utiliza este método para evitar que la aplicación se rompa y mostrar un aviso si ocurre un error.

5. ¿Qué pasa si la URL de la imagen no existe? Propón un comportamiento de respaldo.
Si una imagen no existe, el personaje podría aparecer sin imagen y afectar la presentación de la página. Una alternativa es mostrar una imagen predeterminada o las iniciales del personaje. En mi proyecto se muestran las iniciales mientras carga la imagen y, si falla, se elimina la imagen para que las iniciales puedan seguir apareciendo.

6. ¿Se debe permitir guardar un personaje con nombre solo de espacios en blanco? ¿Y uno duplicado?
No se debería permitir guardar un nombre que solo tenga espacios, porque no sería un nombre válido. Tampoco permitiría nombres duplicados, ya que podrían confundir al usuario al buscar o administrar sus personajes. Una alternativa sería permitir nombres repetidos si cada personaje tiene un id diferente, pero para esta aplicación considero más práctico mantener los nombres únicos.
