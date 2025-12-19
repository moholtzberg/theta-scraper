export const fetchDataFromApi = async (endPoint, wsId, params={}) => {
    let queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'object') {
            for (const [k, v] of Object.entries(value)) {
                queryParams.append(`${key}[${k}]`, v);
            }
        } else {
            queryParams.append(key, value);
        }
    }
    const dataRequest = await fetch(`/api/${endPoint}?workspace_id=${wsId}&${queryParams.toString()}`);
    const dataResult = await dataRequest.json();
    return dataResult;
};

export const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit'};
    return new Date(date).toLocaleDateString(undefined, options);
}

export const toQueryString = (params) => {
    console.log(params);
    let queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) {
            continue;
        }
        if (typeof value === 'object') {
            for (const [k, v] of Object.entries(value)) {
                queryParams.append(`${key}[${k}]`, v);
            }
        } else {
            queryParams.append(key, value);
        }
    }
    return queryParams.toString();
}

export const fetchDataFromApi = async (endPoint, wsId, params={}) => {
    let queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'object') {
            for (const [k, v] of Object.entries(value)) {
                queryParams.append(`${key}[${k}]`, v);
            }
        } else {
            queryParams.append(key, value);
        }
    }
    const dataRequest = await fetch(`/api/${endPoint}?ws_id=${wsId}&${queryParams.toString()}`);
    const dataResult = await dataRequest.json();
    return dataResult;
};
export const postDataToApi = async (endPoint, wsId, params={}) => {
    let queryParams = new URLSearchParams();
    console.log(params);
    for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'object') {
            for (const [k, v] of Object.entries(value)) {
                queryParams.append(`${key}[${k}]`, v);
            }
        } else {
            queryParams.append(key, value);
        }
    }
    const dataRequest = await fetch(`/api/${endPoint}?ws_id=${wsId}&${queryParams.toString()}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const dataResult = await dataRequest.json();
    return dataResult;
}
export const patchDataToApi = async (endPoint, wsId, params={}) => {
    let queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'object') {
            for (const [k, v] of Object.entries(value)) {
                queryParams.append(`${key}[${k}]`, v);
            }
        } else {
            queryParams.append(key, value);
        }
    }
    const dataRequest = await fetch(`/api/${endPoint}?ws_id=${wsId}&${queryParams.toString()}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const dataResult = await dataRequest.json();
    return dataResult;
}
export const deleteDataFromApi = async (endPoint, wsId) => {
    let queryParams = new URLSearchParams();
    const dataRequest = await fetch(`/api/${endPoint}?ws_id=${wsId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const dataResult = await dataRequest.json();
    return dataResult;
}


export const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit'};
    return new Date(date).toLocaleDateString(undefined, options);
}

export const toQueryString = (params) => {
    console.log(params);
    let queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) {
            continue;
        }
        if (typeof value === 'object') {
            for (const [k, v] of Object.entries(value)) {
                queryParams.append(`${key}[${k}]`, v);
            }
        } else {
            queryParams.append(key, value);
        }
    }
    return queryParams.toString();
}
