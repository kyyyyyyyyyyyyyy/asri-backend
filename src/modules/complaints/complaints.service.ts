import { ComplaintsRepository } from "./complaints.repository.js";

export class ComplaintsService {
  constructor(private readonly complaintsRepository = new ComplaintsRepository()) {}
}
