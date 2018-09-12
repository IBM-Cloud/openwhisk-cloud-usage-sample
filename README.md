# IBM Cloud Usage Samples

This project is a companion to the [Reviewing IBM Cloud services, resources and usage](https://console.bluemix.net/docs/tutorials/cloud-usage.html) tutorial. It implements an API-driven approach to obtain and visualize IBM Cloud usage and billing data.

The samples are supported by the following IBM Cloud Functions packages:
[OpenWhisk Cognos Dashboard](https://github.com/IBM-Cloud/openwhisk-cognos-dashboard)
[OpenWhisk JSONetl](https://github.com/IBM-Cloud/openwhisk-jsonetl)
[OpenWhisk SQL Query](https://github.com/IBM-Cloud/openwhisk-sql-query)
[Cloud Object Storage](github.com/ibm-functions/package-cloud-object-storage)

## Before you begin

1. Ensure that you have the appropriate roles to view billing and usage data. For instuctions, see the Assign permissions section of the tutorial.

2. Download and install [wskdeploy](https://github.com/apache/incubator-openwhisk-wskdeploy/releases/tag/0.9.8-incubating). You can add the `wskdeploy` executable to your `PATH` or inside the directory for this tutorial. The `wsdeploy` executable will be used to deploy the various artifacts to IBM Cloud Functions.

## Setup

To deploy the application, use the below commands and installation scripts.

1. Login to IBM Cloud and target your Cloud Foundry account. See [CLI Getting Started](https://console.bluemix.net/docs/cli/reference/bluemix_cli/get_started.html#getting-started).
    ```sh
    ibmcloud login
    ```

    ```sh
    ibmcloud target --cf
    ```

2. Run the following command from the provided makefile. This will create Lite instances of: Cloud Object Storage, SQL Query and Cognos Dashboard Embedded. To change the region where these services are deployed, edit the makefile and update the `REGION` variable. If you already have instances of these services, change the `PLAN` variable in the makefile to `Standard`.
    ```sh
    make create-services
    ```

3. In your browser, access the **usage-tutorial-cos** service instance from the [Dashboard](https://console.bluemix.net/dashboard).

4. Create a new bucket to store usage data.
    - Click the **Create a bucket** button.
    - Select **Cross Region** from the **Resiliency** drop down.
    - Select a location from the **Location**.
    - Provide a bucket **Name** and click **Create** If you receive an *AccessDenied* error, try with a more unique bucket name.

5. Set the location and bucket name as an environment variable to be used later.
    ```sh
    export LOCATION=<your location>
    ```

    ```sh
    export BUCKET=<your bucket name>
    ```

6. Back in the [Dashboard](https://console.bluemix.net/dashboard), access the **usage-tutorial-sql** instance.

7. Click the **Instance CRN** button to copy it to the clipboard, and again set an environment variable.
    ```sh
    export INSTANCE_CRN=<your instance crn>
    ```

8. Set an environment variable to capture usage data for a given month. The format is YYYY-MM.
    ```sh
    export MONTH=2018-09
    ```

9. Run the following commands to create a Platform API Key and Authentication Tokens to be used with the application. The API Key will be used with SQL Query. Authentication tokens will be used to make requests to obtain billing and usage data.
    ```sh
    export API_KEY=`ibmcloud iam api-key-create usage-tutorial-key -d 'apiKey created for http://github.com/IBM-Cloud/cloud-usage-samples' | grep 'API Key' | awk ' {print $3} '`
    ```

    ```sh
    export IAM_TOKEN=`ibmcloud iam oauth-tokens | head -n 1 | awk ' {print $4} '`
    ```

    ```sh
    export UAA_TOKEN=`ibmcloud iam oauth-tokens | tail -n 1 | awk ' {print $4} '`
    ```

10. Deploy the tutorial package to IBM Cloud Functions.
    ```sh
    make deploy
    ```

11. Bind your Cloud Object Storage and Cognos Dashboard Embedded service credentials to the packages.
    ```sh
    make bind-services
    ```

## Invoke OpenWhisk actions

To obtain and process billing and usage data, you'll execute several IBM Cloud Functions sequences.

1. Obtain an account GUID to fetch usage data. The account GUID you choose should match the **Account:** value seen in the `target` output.
    ```sh
    ibmcloud target && ibmcloud iam accounts
    ```

2. Start the sequence to retrieve and process resource group's usage for the account. You can watch progress using the [Monitor](https://console.bluemix.net/openwhisk/dashboard) dashboard in the IBM Cloud Functions service.
    ```sh
    ibmcloud fn action invoke tutorial-etl-process/resource-groups-billing --param guid e97a8c01ac694e308ef3ad77958e7d50 -r
    ```

3. After all data has been collected, run the sequence to collect Cloud Foundry usage for the account.
    ```sh
    ibmcloud fn action invoke tutorial-etl-process/cf-orgs-billing -r
    ```

4. Check you Cloud Object Storage bucket, it should now contain files that contain usage data for the various services and resources.

5. Open the **usage-tutorial-sql** services UI from the [Dashboard](https://console.bluemix.net/dashboard/apps).

6. From the command line, run the following sequence. The SQL Query UI will show progress and the result data when complete.
    ```sh
    ibmcloud fn action invoke tutorial-etl-query/billing-job -r
    ```

7. Once the SQL Query job has completed, copy the `job_id` returned from the sequence.

8. Run the following command to get the URL to the billing dashboard. Append the `job_id` value to the URL similar to the example below.

    ```sh
    ibmcloud fn api list | grep 'Tutorial Dashboard'
    ```

    ```curl
    https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/<your gateway id>/tutorial/billing?job_id=<your job id>
    ```

9. Visit the dashboard URL in your browser to see a pre-created Cognos Embedded Dashboard with your usage data.