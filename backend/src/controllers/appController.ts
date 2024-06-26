import apps from "../models/app";
import iApp, { iAppDocument } from "../types/app";
import iEndpoint from "../types/endpoint";
import iReport from "../types/report";
import iLog from "../types/log";
import { Mail } from "../utils/mail";

export const createApp = async (appData: iApp) => {
  const newApp = new apps(appData);
  await newApp.save();
  return { status: 200, appId: newApp._id.toString()};
};

export const getAllApps = async () => {
    return await apps.find();
};

export const getAppById = async (id: string) => {
    return await apps.findById(id);
}

export const addEndpointToApp = async (appId: string, endpoint: iEndpoint) => {
    const app = await apps.findById(appId);
    if (!app) {
        throw new Error('App not found');
    }
    app.endpoints.push(endpoint);
    await app.save();
    return 200;
}

export const addReportToApp = async (appId: string, report: iReport, email: string) => {
    const app = await apps.findById(appId);
    if (!app) {
        throw new Error('App not found');
    }
    app.reports.push(report);
    await app.save();

    await Mail.sendMail(email, 'New bug reported', 'A new bug has been reported on your app. Please check the reports section in the dashboard.');

    return 200;
}

export const addLogToEndpoint = async (appId: string, endpointName: string, log: iLog) => {
    const app: iAppDocument | null = await apps.findById(appId);
    if (!app) {
        throw new Error('App not found');
    }
    const endpoints: [iEndpoint] | undefined = app.endpoints;
    const endpointIndex: number | undefined = endpoints?.findIndex((e: iEndpoint) => e.name === endpointName);
    if (endpointIndex === undefined || endpointIndex === -1) {
        throw new Error('Endpoint not found');
    }
    endpoints?.at(endpointIndex)?.logs?.push(log);
    (app ?? false) && (app.endpoints = endpoints);
    await app.save();
    return 200;
}

export const getAppWithLatestLogs = async (id: string, hours: number) => {
    const app: iAppDocument | null = await apps.findById(id);
    if (!app) {
        throw new Error('App not found');
    }
    const endpoints: [iEndpoint] | undefined = app.endpoints;

    const newEndpoints: iEndpoint[] = [];

    endpoints?.forEach((e: iEndpoint) => {
        const logs: iLog[] = [];
        e.logs?.forEach((l: iLog) => {
            if (new Date().getTime() - l.time.getTime() < hours * 3600000) {
                logs.push(l);
            }
        });
        newEndpoints.push({ ...e, logs });
    });

    return { ...app.toObject(), endpoints: newEndpoints };
}

export const updateReport = async (appId: string, reportId: string) => {
    const app = await apps.findById(appId);
    if (!app) {
        throw new Error('App not found');
    }
    const reports: iReport[] | undefined = app.reports.toObject();
    if (!reports) {
        throw new Error('Reports not found');
    }
    const reportIndex: number | undefined = reports?.findIndex((r: iReport) => r._id === reportId);
    if (reportIndex === undefined || reportIndex === -1) {
        throw new Error('Report not found');
    }
    reports[reportIndex].fixed = true;
    await apps.findByIdAndUpdate(appId, { reports });
    console.log(reports);
    return 200;
}