#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ReactTypescriptTemplateStack } from '../lib/ReactTypescriptTemplateStack';

const app = new cdk.App();
new ReactTypescriptTemplateStack(app, 'ReactTypescriptTemplateStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
