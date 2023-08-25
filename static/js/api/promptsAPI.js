const ApiFetchPrompts = async () => {
    const api_url = V.build_api_url('prompts', 'prompts')
    const res = await fetch(`${api_url}/${getSelectedProjectId()}`, {
        method: 'GET',
    })
    return res.json();
}

const ApiFetchPromptById = async (promptId) => {
    const api_url = V.build_api_url('prompts', 'prompt')
    const res = await fetch(`${api_url}/${getSelectedProjectId()}/${promptId}`, {
        method: 'GET',
    })
    return res.json();
}

const ApiCreatePrompt = async (promptName) => {
    const api_url = V.build_api_url('prompts', 'prompts')
    const res = await fetch(`${api_url}/${getSelectedProjectId()}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": promptName,
            "type": "freeform",
            "prompt": "",
        })
    })
    return res.json();
}

const ApiUpdatePrompt = async (prompt) => {
    const api_url = V.build_api_url('prompts', 'prompt')
    const res = await fetch(`${api_url}/${getSelectedProjectId()}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id": prompt.id,
            "name": prompt.name,
            "type": "freeform",
            "prompt": prompt.prompt,
            "tags": prompt.tags,
        })
    })
    return res.json();
}

const ApiUpdateExampleField = async (promptId, exampleId, input, output) => {
    const api_url = V.build_api_url('prompts', 'example')

    const res = await fetch(`${api_url}/${getSelectedProjectId()}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "prompt_id": promptId,
            "id": exampleId,
            "input": input,
            "output": output,
            "is_active": true,
        })
    })
    return res.json();
}

const ApiUpdateVariableField = async (promptId, varId, name, value) => {
    const api_url = V.build_api_url('prompts', 'variable')

    const res = await fetch(`${api_url}/${getSelectedProjectId()}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "prompt_id": promptId,
            "id": varId,
            "name": name,
            "value": value,
        })
    })

    if (!res.ok) {
        const error = await res.json();
        const msg = "Error occurred while variable update\n" + error?.map(i => i?.msg || '').join('\n')
        throw Error(msg)
    }

    return res.json();
}

const ApiCreateExample = async (promptId, input, output) => {
    const api_url = V.build_api_url('prompts', 'example')
    const res = await fetch(`${api_url}/${getSelectedProjectId()}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "prompt_id": promptId,
            "input": input,
            "output": output,
        })
    })
    return res.json();
}

const ApiCreateVariable = async (promptId, name, value) => {
    const api_url = V.build_api_url('prompts', 'variable')
    const res = await fetch(`${api_url}/${getSelectedProjectId()}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "prompt_id": promptId,
            "name": name,
            "value": value,
        })
    })
    if (!res.ok) {
        const error = await res.json();
        const msg = "Error occurred\n" + error?.map(i => i?.msg || '').join('\n')
        showNotify('ERROR', msg)
        throw Error(msg)
    }
    return res.json();
}

const ApiRunTest = async (prompt, input, integrationId, project_id) => {
    const api_url = V.build_api_url('prompts', 'predict')
    const res = await fetch(`${api_url}/${getSelectedProjectId()}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "prompt_id": prompt.id,
            "project_id": project_id,
            "integration_id": integrationId,
            "integration_settings": prompt.integration_settings,
            "input": input,
        })
    })

    if (!res.ok) {
        const errorMsg = await res.text();
        throw Error(errorMsg)
    }

    return res.json();
}

const ApiDeletePrompt = async (promptId) => {
    const api_url = V.build_api_url('prompts', 'prompt')
    const res = await fetch(`${api_url}/${getSelectedProjectId()}/${promptId}`, {
        method: 'DELETE',
    })
}

const ApiDeleteExample = async (exampleId) => {
    const api_url = V.build_api_url('prompts', 'example')
    const res = await fetch(`${api_url}/${getSelectedProjectId()}/${exampleId}`, {
        method: 'DELETE',
    })
}

const ApiDeleteVariable = async (variableId) => {
    const api_url = V.build_api_url('prompts', 'variable')
    const res = await fetch(`${api_url}/${getSelectedProjectId()}/${variableId}`, {
        method: 'DELETE',
    })
}

const fetchTagsAPI = async () => {
    const api_url = V.build_api_url('prompts', 'tags')
    const res = await fetch(`${api_url}/${getSelectedProjectId()}`, {
        method: 'GET',
    })
    return res.json();
}
const fetchPromptTagsAPI = async (promptId) => {
    const api_url = V.build_api_url('prompts', 'tags')
    const res = await fetch(`${api_url}/${getSelectedProjectId()}/${promptId}`, {
        method: 'GET',
    })
    return res.json();
}

const updatePromptTagsAPI = async (tags, promptId) => {
    const api_url = V.build_api_url('prompts', 'tags')
    const res = await fetch(`${api_url}/${getSelectedProjectId()}/${promptId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tags)

    })
    return res.json();
}