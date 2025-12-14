import ExcelJS from "exceljs";
import pool from "../config/db.js";


export const exportPersonsExcel = async (req, res) => {
  try {
    // 1) Traer data (puedes usar tu SP)
    const [rows] = await pool.query("CALL sp_person_list()");
    const persons = rows[0] || [];

    // 2) Crear workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Hermandad System";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Personas");

    // 3) Encabezados
    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Nombres", key: "first_name", width: 18 },
      { header: "Apellidos", key: "last_name", width: 18 },
      { header: "DNI", key: "dni", width: 14 },
      { header: "Teléfono", key: "phone", width: 16 },
      { header: "Dirección", key: "address", width: 28 },
      { header: "Nacimiento", key: "birth_date", width: 14 },
      { header: "Creado", key: "created_at", width: 18 },
    ];

    // Estilo header
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).alignment = { vertical: "middle" };
    sheet.getRow(1).height = 18;

    // 4) Filas
    persons.forEach((p) => {
      sheet.addRow({
        id: p.id,
        first_name: p.first_name ?? "",
        last_name: p.last_name ?? "",
        dni: p.dni ?? "",
        phone: p.phone ?? "",
        address: p.address ?? "",
        birth_date: p.birth_date ?? "",
        created_at: p.created_at ?? "",
      });
    });

    // 5) Bordes simples
    sheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        if (rowNumber === 1) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEFEFEF" } };
        }
      });
    });

    // 6) Enviar como descarga
    const fileName = `personas_${new Date().toISOString().slice(0, 10)}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Importante: escribir al response stream
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("❌ Error exportPersonsExcel:", error);
    res.status(500).json({ message: "Error exporting Excel" });
  }
};