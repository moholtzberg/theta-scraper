import { json, error } from "@sveltejs/kit";
import { PAPERFEED_BEARER_TOKEN } from "$env/static/private";

const bearerToken = PAPERFEED_BEARER_TOKEN;
const baseUrl = "https://api.paperfeed.io/api/v1/containers";

export async function GET({ url, params }) {
  console.log("GET Params: ", params);
  console.log("GET URL: ", url);
  const containerType = params.resource;
  const pageId = params.id;
  const workspaceId = url.searchParams.get("ws_id");
  url.searchParams.delete("ws_id");
  const filters = url.searchParams.toString();

  const endPoint = `${baseUrl}/${pageId}?workspace_id=${workspaceId}&container_type=${containerType}`;
  console.log("End Point: ", endPoint);
  const response = await fetch(endPoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  const data = await response.json();

  return json(data);
}

export async function PATCH({ params, url }) {
  const sentParams = url.searchParams;
  const pageId = params.id;
  const containerType = params.resource;
  const workspaceId = sentParams.get("ws_id");
  sentParams.delete("workspace_id");
  
  let meta = {};
  for (let key of sentParams.keys()) {
    meta[key] = sentParams.get(key);
  }
  sentParams.delete("resource");

  const endPoint = `${baseUrl}/${pageId}?workspace_id=${workspaceId}&container_type=${containerType}`;

  const response = await fetch(endPoint, {
    method: 'PATCH',
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

export async function DELETE({ params, url }) {
  const pageId = params.id;
  const containerType = params.resource;
  const workspaceId = url.searchParams.get("ws_id");

  const endPoint = `${baseUrl}/${pageId}?workspace_id=${workspaceId}&container_type=${containerType}`;
  const response = await fetch(endPoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  const data = await response.json();

  return json(data);
}
