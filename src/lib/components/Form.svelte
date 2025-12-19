<script>
    import { page } from "$app/stores";
    let { fields, containerType, workspaceId, success, message } = $props();
    let site = "impactswipe.com"
    const baseUrl = `/api/${containerType}?workspace_id=${workspaceId}`;
    console.log($page.url.searchParams.toString());
    let newContainer = {};

    fields.forEach(field => {
        if (field.type === "checkboxes") {
            newContainer[field.name] = {};
            field.options.forEach(option => {
                newContainer[field.name][option] = false;
            }); 
        } else {
            newContainer[field.name] = "";
        }
    });


    newContainer.params = $page.url.searchParams.toString();


    const submitForm = async () => {
        console.log(newContainer);
        let requestParams = new URLSearchParams();
        if (newContainer.interest) {
            let interest = "";
            console.log(newContainer.interest);
            for (let key in newContainer.interest) {
                
                if (newContainer.interest[key] === true) {
                    interest += key + ",";
                }
            }
            newContainer.interest = interest.slice(0, -1);
        }
        for (let key in newContainer) {
            requestParams.append(key, newContainer[key]);
        }
        console.log(requestParams);
        // if the key is interest, we need to convert them all to a single string
        let response = await fetch(`${baseUrl}&${requestParams.toString()}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        let data = await response.json();
        console.log(data);
        success = true;
        // clear the form
        newContainer = {};
    };


</script>

<div class="flex flex-col  w-full">
    {#if message}
        <p class="mt-4 text-lg text-gray-700">{message}</p>
    {:else}
        <p class="mt-4 text-lg text-gray-700">Please fill out the {containerType.replace(/_/g, " ")} form below, and a member of our team will reach out to you shortly.</p>
    {/if}
    
    {#if success}
    <p class="text-{site.tertiary_color} text-xl tracking-wider mx-4">Thank you for your submission. A member of our team will reach out to you shortly.</p>
    {:else}
    <div class="flex flex-col gap-3 pt-4">
        <!-- get all the rows interate over the rows an display the fields for that row -->
        {#each Array.from(new Set(fields.map(field => field.row))) as row}
        <div class="{row === 6 ? 'bg-gray-100 p-1 flex flex-row' : ''}" >
            <div class="flex flex-col gap-3 md:flex-row">
                {#each fields.filter(field => field.row === row) as field}
                    {#if field.type === "textarea"}
                        <div class="flex flex-col w-full h-auto">
                            <!-- <label class="block text-gray-700 font-bold mb-2" for={field.name}>{field.label}</label> -->
                            <textarea class="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500" id={field.name} name={field.name} rows="4" cols="50" placeholder={field.label} bind:value={newContainer[field.name]}></textarea>
                        </div>
                    {:else if field.type === "select"}
                        <div class="flex flex-col w-full h-auto">
                            <!-- <label class="block text-gray-700 font-bold mb-2" for={field.name}>{field.label}</label> -->
                            <select class="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500" id={field.name} name={field.name}  placeholder={field.label} bind:value={newContainer[field.name]}>
                                {#each field.options as option}
                                    <option value={option}>{option}</option>
                                {/each}
                            </select>
                        </div>
                    <!-- {:else if field.type === "radio"}
                        <div class="flex flex-col w-full h-auto mt-3">
                            <label class="block text-gray-700 font-bold mb-2" for={field.name}>{field.label}</label>
                            {#each field.options as option}
                                <input type="radio" id={option} name={field.name} value={option} bind:checked={newContainer[field.name]} />
                                <label for={option}>{option}</label>
                            {/each}
                        </div> -->
                    {:else if field.type === "date"}
                        <div class="flex flex-col w-full h-auto">
                            <!-- <label class="block text-gray-700 font-bold mb-2" for={field.name}>{field.label}</label> -->
                            <input class="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500" type="date" id={field.name} name={field.name} placeholder={field.label} bind:value={newContainer[field.name]} />
                        </div>
                    {:else if field.type === "checkboxes"}
                        <div class="flex flex-row w-full h-auto">
                            <div class="flex flex-col w-full">
                                <label class="block text-gray-700 font-bold mb-2" for={field.name}>{field.label}</label>
                                {#each field.options as option}
                                    <!-- <input type="checkbox" id={option} name={option} value={option} bind:checked={newContainer[field.name][option]} /> -->
                                    <label for={option} placeholder={field.label}></label>
                                {/each}
                            </div>
                        </div>
                    {:else if field.type === "hidden"}
                        <input type="hidden" id={field.name} name={field.name} bind:value={newContainer[field.name]} />
                        <p class="mt-3 block w-full">
                            {#if newContainer.params}
                                {#each newContainer.params.split("&") as param}
                                    {param.split("=")[0].charAt(0).toUpperCase() + param.split("=")[0].slice(1)}: {param.split("=")[1]}<br>
                                {/each}
                            {/if}
                        </p>
                    {:else}
                        <div class="flex flex-col w-full h-16">
                            <!-- <label class="block text-gray-700 font-bold mb-2" for={field.name}>{field.label}</label> -->
                            <input class="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-indigo-500" type="text" id={field.name} name={field.name} placeholder={field.label} bind:value={newContainer[field.name]} />
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
        {/each}
        <div class="w-full flex justify-center justify-items-center">
            <button class="px-8 py-3 bg-indigo-600 text-white rounded-full text-lg font-semibold hover:bg-indigo-700 w-full" on:click={submitForm}>Submit Inquiry</button>
        </div>
    </div>
    {/if}
</div>
