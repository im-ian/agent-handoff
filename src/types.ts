export type ProfileName = 'claude' | 'codex';

export interface Substitution {
  from: string;
  to: string;
}

export interface ScopeConfig {
  include: string[];
  optIn: string[];
  excludeExtra: string[];
}

export interface SecretPolicy {
  // Relative paths the scanner should not inspect (e.g. files the user has
  // verified contain intentional template placeholders that match secret regexes).
  allow: string[];
}

export interface DeviceConfig {
  profile: ProfileName;
  device: string;
  hubRemote: string;
  appDir: string;
  substitutions: Substitution[];
  scope: ScopeConfig;
  secretPolicy: SecretPolicy;
}

export interface DeviceVersion {
  pushedAt: string;
  host: string;
  fileCount: number;
  byteCount: number;
}

export type DeviceManifestEntry = Partial<Record<ProfileName, DeviceVersion>>;

export interface HubManifest {
  version: 2;
  devices: Record<string, DeviceManifestEntry>;
  updatedAt: string;
}

export interface DependencyEntry {
  description?: string;
  install: {
    darwin?: string;
    linux?: string;
  };
}

export interface DependencyManifest {
  version: 1;
  dependencies: Record<string, DependencyEntry>;
}
