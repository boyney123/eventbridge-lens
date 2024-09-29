// import * as AWS from 'aws-sdk';
import { workspace } from "vscode";

import { fromIni } from "@aws-sdk/credential-providers";
import { AwsCredentialIdentityProvider } from "@aws-sdk/types";

export function getAwsCredentials(): AwsCredentialIdentityProvider {

  const config = workspace.getConfiguration("eventbridgelens");
  const profile = (config.get("credentialsProfile") as string) || "default";

  const credentials = fromIni({
    profile,
  });

  return credentials;
}
export function getAwsRegion(): string {
  const config = workspace.getConfiguration("eventbridgelens");
  return (config.get("region") as string) || "us-east-1";
}
