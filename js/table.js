class HtmlDataTable {
  constructor(elementId) {
    /** @type {HTMLTableElement} */
    this.tableElement = document.getElementById(elementId);
    this.targetRow = -1;
    for (const row of this.tableElement.rows) {
      const lastCell = Array.from(row.cells).at(-1);
      lastCell.addEventListener("click", () => {
        this.targetRow = row.rowIndex;
      });
    }
  }

  getTargetRowElement() {
    return this.tableElement.rows.item(this.targetRow)
  }

  getCellContainsId() {
    const targetRow = this.getTargetRowElement();
    if (!targetRow) return null;
    for (const cell of targetRow.cells) {
      if (/\d+/.test(cell.innerText)) {
        return cell;
      }
    }
    return null;
  }
}
