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
    res.status(500).json({ message: "Ocurrió un error al exportar el archivo Excel." });
  }
};

export const exportExpensesExcel = async (req, res) => {
  try {
    const [rows] = await pool.query("CALL sp_expense_list()");
    const espenses = rows[0] || [];

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Hermandad System";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Egresos");

    sheet.columns = [
      { header: "Persona", key: "person", width: 18 },
      { header: "Monto", key: "amount", width: 18 },
      { header: "Fecha", key: "date", width: 14 },
      { header: "Tipo", key: "type", width: 16 },
      { header: "Descripción", key: "description", width: 28 }
    ];

    // Estilo header
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).alignment = { vertical: "middle" };
    sheet.getRow(1).height = 18;

    // 4) Filas
    espenses.forEach((p) => {
      sheet.addRow({
        person: p.person_name ?? "",
        amount: p.amount ?? "",
        date: p.created_at ?? "",
        type: p.expense_type ?? "",
        description: p.description ?? ""
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
    const fileName = `egresos_${new Date().toISOString().slice(0, 10)}.xlsx`;

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
    res.status(500).json({ message: "Ocurrió un error al exportar el archivo Excel de Egresos." });
  }
};

export const exportIncomesExcel = async (req, res) => {
  try {
    const [rows] = await pool.query("CALL sp_income_list()");
    const incomes = rows[0] || [];

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Hermandad System";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Egresos");

    sheet.columns = [
      { header: "Persona", key: "person", width: 18 },
      { header: "Monto", key: "amount", width: 18 },
      { header: "Fecha", key: "date", width: 14 },
      { header: "Tipo", key: "type", width: 16 },
      { header: "Referencia", key: "reference", width: 28 },
      { header: "Nota", key: "note", width: 28 }
    ];

    // Estilo header
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).alignment = { vertical: "middle" };
    sheet.getRow(1).height = 18;

    // 4) Filas
    incomes.forEach((p) => {
      sheet.addRow({
        person: p.person_name ?? "",
        amount: p.amount ?? "",
        date: p.income_date ?? "",
        type: p.income_type ?? "",
        reference: p.reference ?? "",
        note: p.notes ?? ""
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
    const fileName = `ingresos_${new Date().toISOString().slice(0, 10)}.xlsx`;

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
    res.status(500).json({ message: "Ocurrió un error al exportar el archivo Excel de Egresos." });
  }
};

export const exportReportExcel = async (req, res) => {  
  try {
    const { typeReport } = req.body;

    let procedureName;
    let reportName;

    switch (typeReport) {
      case "daily":
        procedureName = "sp_report_daily()";
        reportName = "Diario";
        break;

      case "weekly":
        procedureName = "sp_report_weekly()";
        reportName = "Semanal";
        break;

      case "monthly":
        procedureName = "sp_report_monthly()";
        reportName = "Mensual";
        break;

      case "yearly":
        procedureName = "sp_report_yearly()";
        reportName = "Anual";
        break;

      default:
        throw new Error("Debe seleccionar un tipo de reporte.");
    }

    const [rows] = await pool.query(`CALL ${procedureName}`);
    const incomes = rows[0] || [];

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Hermandad System";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet(`Reporte ${reportName}`);

    sheet.columns = [
      { header: "Periodo", key: "period", width: 18 },
      { header: "Total de ingreso", key: "totalIncome", width: 18, style: { numFmt: '"S/ "#,##0.00' }  },
      { header: "Total de egreso", key: "totalExpense", width: 18, style: { numFmt: '"S/ "#,##0.00' }  },
      { header: "Balance", key: "balance", width: 18, style: { numFmt: '"S/ "#,##0.00' }  },
    ];

    // Estilo header
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).alignment = { vertical: "middle" };
    sheet.getRow(1).height = 18;

    // 4) Filas
    incomes.forEach((p) => {
      sheet.addRow({
        period: p.period ?? "",
        totalIncome: Number(p.total_income) ?? 0.0,
        totalExpense: Number(p.total_expense) ?? 0.0,
        balance: (Number(p.total_income) - Number(p.total_expense)) ?? 0.0,
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
    const fileName = `${reportName}_${new Date().toISOString().slice(0, 10)}.xlsx`;

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
    res.status(500).json({ message: "Ocurrió un error al exportar el archivo Excel de Egresos." });
  }
};