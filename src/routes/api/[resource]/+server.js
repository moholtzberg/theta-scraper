import { json, redirect } from '@sveltejs/kit';
import pluralize from 'pluralize';
import { PAPERFEED_BEARER_TOKEN } from "$env/static/private";

const bearerToken = PAPERFEED_BEARER_TOKEN;
const baseUrl = 'https://api.paperfeed.io/api/v1/containers';

export async function GET({ url, params, fetch }) {
    const containerType = params.resource;

    let searchParams = url.searchParams.keys();
    const workspaceId = url.searchParams.get('ws_id');
    // remove workspace_id from searchParams
    url.searchParams.delete('ws_id');
    const filters = url.searchParams.toString();
    const endPoint = `${baseUrl}?workspace_id=${workspaceId}&container_type=${containerType}&${filters}`;
    // console.log("End Point: ", endPoint)
    const response = await fetch(endPoint, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${bearerToken}`
        },
    });
    const data = await response.json();
    return json(data);
}

export async function POST({ params, fetch, url }) {
    let sentParams = await url.searchParams;
    const containerType = params.resource;
    const workspaceId = sentParams.get('ws_id');
    sentParams.delete('ws_id');
    let meta = {};
    for (let key of sentParams.keys()) {
        meta[key] = sentParams.get(key);
    }
    sentParams.delete('resource');

    const endPoint = `${baseUrl}/?workspace_id=${workspaceId}&container_type=${containerType}`;
    console.log("Post End Point: ", endPoint);
    const response = await fetch(endPoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            container_type: containerType,
            workspace_id: workspaceId,
            container: {
                meta: {
                    ...meta
                }
            }
        })
    });
    const data = await response.json();
    
    return json(data);
}
