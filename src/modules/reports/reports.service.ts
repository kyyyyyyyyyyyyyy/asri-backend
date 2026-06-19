import { ReportsRepository } from "./reports.repository.js";

export class ReportsService {
  constructor(private readonly reportsRepository = new ReportsRepository()) {}
}
