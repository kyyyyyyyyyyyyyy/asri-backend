import { ProfilesRepository } from "./profiles.repository.js";

export class ProfilesService {
  constructor(private readonly profilesRepository = new ProfilesRepository()) {}
}
