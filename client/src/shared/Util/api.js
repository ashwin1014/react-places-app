export const getApi = async (url) => {
    let apiBody = {
        error: null,
        response: null
    };
    try {
      const getResponse = await fetch(url);
      const response = await getResponse.json();
      if(!getResponse.ok) {
        throw new Error(response.message);
      }
        apiBody = {
            error: null,
            response
        };
    } catch (error) {
        apiBody = {
            error,
            response: null
        };
    }

    return apiBody;
};

export const postApi = async (url, body, isFormData = false) => {
    let apiBody = {
        error: null,
        response: null
    };
    try {
        let getResponse;
        if (!isFormData) {
            getResponse = await fetch (url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
        }
        if (isFormData) {
            getResponse = await fetch (url, {
                method: 'POST',
                body
            });
        }
        const response = await getResponse.json();
        // checks for status 200 else go to catch block
        if(!getResponse.ok) {
            // console.log('API', response.message)
            throw new Error(response.message);
        }
       apiBody = {
        error: null,
        response
       };
    } catch (error) {
        // console.log('API Error', error)
        apiBody = {
            error,
            response: null
        };
    }
    return apiBody;
};
