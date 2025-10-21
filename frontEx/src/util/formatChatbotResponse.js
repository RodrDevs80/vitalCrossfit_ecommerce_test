const formatChatbotResponse = (text) => {
  // Expresión regular mejorada para detectar tablas Markdown
  const tableRegex = /(\|.*\|\s*\n\|[-|\s]+\|\s*\n)((?:\|.*\|\s*\n)+)/g;

  return text.replace(tableRegex, (match, header, rows) => {
    const rowsArray = rows.trim().split('\n');
    let formattedText = '';
    let currentCategory = '';

    rowsArray.forEach(row => {
      // Limpiar y dividir las celdas
      const cells = row.split('|')
        .filter(cell => cell.trim() !== '')
        .map(cell => cell.trim());

      if (cells.length >= 2) {
        const category = cells[0];
        const exercise = cells[1];
        const equipment = cells[2] || '';
        const details = cells[3] || '';

        // Agrupar por categoría con emojis
        if (category !== currentCategory) {
          formattedText += `\n${category.toUpperCase()}:\n`;
          currentCategory = category;
        }

        // Formatear cada ejercicio
        formattedText += `• ${exercise}`;
        if (equipment) formattedText += ` (${equipment})`;
        if (details) formattedText += ` - ${details}`;
        formattedText += '\n';
      }
    });

    return formattedText;
  });
}

export default formatChatbotResponse;