# Authorization Concepts

There are two main security concerns for any application:

- **Authentication**: Authentication answers the question of “Who are you?” which usually manifest itself as a login page with email and password
- **Authorization**: Authorization answers the question of "What are you allowed to do?” which usually manifest itself when we check the user to see if he’s allowed to see or do particular things in the app

There are several Auth Providers like:

- Auth0
- Okta

There are several popular Auth Protocols like:

- OAuth 2.0
- OpenID Connect (OIDC)
- Security Assertion Markup Language (SAML)
- Web Services Foundation
- Lightweight Directory Access Protocol (LDAP)

## OAuth 2.0 Framework

The OAuth 2.0 authorization framework is a protocol that allows a user to grant a third-party web site or application access to the user's protected resources, without necessarily revealing their long-term credentials or even their identity.

### OAuth 2.0 Roles

- **Resource Owner**: Entity that can grant access to a protected resource. Typically, this is the end-user.
- **Resource Server**: Server hosting the protected resources. This is the API (data) that you want to access
- **Client**: Application requesting access to a protected resource on behalf of the Resource Owner.
- **Authorization Server**: Server that authenticates the Resource Owner and issue access tokens after getting proper authorizations. E.g. this could be Auth0

The permissions represented by the access token, in OAuth terms, are known as scopes.

Take this example for demonstrating the above roles:
Suppose that you create a _react app_ that needs to access the _basic google account information_ of the _user_.  
In this example the roles are:

- User => Resource Owner
- Google => Resource Server
- Client => React app
- Authorization Server: E.g. Auth0
- Scope: Basic account info

So here's how these roles interact with each other: OAuth introduces an authorization layer and separates the role of the **client** from the **resource owner**. In OAuth, the client request access to resources controlled by the **resource owner** which are hosted by the **resource server** and is issued a different set of credentials than those if the **resource owner**. Instead of using the **resource owner**'s credentials to access protected resources, the client obtains an **access token** (a string denoting a specific scope, lifetime and other access attributes). Access tokens are issued to third-party clients by an **authorization server** with the approval of the **resource owner**. Then the client uses the access token to access the protected resources hosted by the **resource server**.

### OAuth 2.0 Grant Types

OAuth 2.0 defines four flows to get access tokens. These flows are called grant types. Deciding which one is suited for your application depends mostly on your application type/

- **Authorization Code Flow**: used by Web Apps executing on a server.
- **Implicit Flow with Form Post**: used by Javascript centric apps (Single Page application) executing on the user's browser
- **Resource Owner Password Flow**: used by highly-trusted apps
- **Client Credentials Flow**: Used for machine-to-machine communication.

#### Authorization Code Flow

Because regular web apps are server-side apps where the source code is not publicly exposed, they can use the Authorization Code Flow, which exchanges an **Authorization Code** for a **Token**. Your app must be server-side because during this exchange, you must also pass along your application's **Client Secret**, which must always be kept secure, and you will have to store it in your client.

![Client Secret](./docs/images/oauth2-authorization-code-flow.png)

1. The user clicks Login within the regular web application.
2. Auth0's SDK redirects the user to the Auth0 Authorization Server (`/authorize` endpoint).
3. Your Auth0 Authorization Server redirects the user to the login and authorization prompt.
4. The user authenticates using one of the configured login options and may see a consent page listing the permissions Auth0 will give to the regular web application.
5. Your Auth0 Authorization Server redirects the user back to the application with an authorization code, which is good for one use.
6. Auth0's SDK sends this code to the Auth0 Authorization Server (`/oauth/token` endpoint) along with the application's Client ID and Client Secret.
7. Your Auth0 Authorization Server verifies the code, Client ID, and Client Secret.
8. Your Auth0 Authorization Server responds with an ID Token and Access Token (and optionally, a Refresh Token).
9. Your application can use the Access Token to call an API to access information about the user.
10. The API responds with requested data.

##### Authorization Code Flow with Proof Key for Code Exchange (PKCE)

When public clients (e.g., native and single-page applications) request Access Tokens, some additional security concerns are posed that are not mitigated by the Authorization Code Flow alone. This is because:

**Native apps**

- Cannot securely store a Client Secret. Decompiling the app will reveal the Client Secret, which is bound to the app and is the same for all users and devices.

- May make use of a custom URL scheme to capture redirects (e.g., `MyApp://`) potentially allowing malicious applications to receive an Authorization Code from your Authorization Server.

**Single-page apps**

- Cannot securely store a Client Secret because their entire source is available to the browser.

To mitigate this, OAuth 2.0 provides a version of the Authorization Code Flow which makes use of a Proof Key for Code Exchange

The PKCE-enhanced Authorization Code Flow introduces a secret created by the calling application that can be verified by the authorization server; this secret is called the Code Verifier. Additionally, the calling app creates a transform value of the Code Verifier called the Code Challenge and sends this value over HTTPS to retrieve an Authorization Code. This way, a malicious attacker can only intercept the Authorization Code, and they cannot exchange it for a token without the Code Verifier.

![Native apps](./docs/images/oauth2-authorization-code-flow-pkce.png)

1. The user clicks Login within the application.
2. Auth0's SDK creates a cryptographically-random code_verifier and from this generates a code_challenge.
3. Auth0's SDK redirects the user to the Auth0 Authorization Server (/authorize endpoint) along with the code_challenge.
4. Your Auth0 Authorization Server redirects the user to the login and authorization prompt.
5. The user authenticates using one of the configured login options and may see a consent page listing the permissions Auth0 will give to the application.
6. Your Auth0 Authorization Server stores the code_challenge and redirects the user back to the application with an authorization code, which is good for one use.
7. Auth0's SDK sends this code and the code_verifier (created in step 2) to the Auth0 Authorization Server (/oauth/token endpoint).
8. Your Auth0 Authorization Server verifies the code_challenge and code_verifier.
9. Your Auth0 Authorization Server responds with an ID Token and Access Token (and optionally, a Refresh Token).
10. Your application can use the Access Token to call an API to access information about the user.
11. The API responds with requested data.

#### Implicit Flow with Form Post

You can use OpenID Connect (OIDC) with many different flows to achieve web sign-in for a traditional web app. In one common flow, you obtain an ID token using authorization code flow performed by the app backend. This method is effective and robust, however, it requires your web app to obtain and manage a secret. You can avoid that burden if all you want to do is implement sign-in and you don’t need to obtain access tokens for invoking APIs.

Implicit Flow with Form Post flow uses OIDC to implement web sign-in that is very similar to the way SAML and WS-Federation operates. The web app requests and obtains tokens through the front channel, without the need for secrets or extra backend calls. With this method, you don’t need to obtain, maintain, use, and protect a secret in your application.

You should use this flow for login-only use cases; if you need to request Access Tokens while logging the user in so you can call an API, use the Authorization Code Flow with PKCE or the Hybrid Flow.

![alt](./docs/images/oauth2-implicit-flow-with-form-post.png)

1. The user clicks Login in the app.
2. Auth0's SDK redirects the user to the Auth0 Authorization Server (`/authorize` endpoint) passing along a response_type parameter of id_token that indicates the type of requested credential. It also passes along a response_mode parameter of form_post to ensure security.
3. Your Auth0 Authorization Server redirects the user to the login and authorization prompt.
4. The user authenticates using one of the configured login options and may see a consent page listing the permissions Auth0 will give to the app.
5. Your Auth0 Authorization Server redirects the user back to the app with an ID Token.

#### Resource Owner Password Flow

Though we do not recommend it, highly-trusted applications can use the Resource Owner Password Flow, which requests that users provide credentials (username and password), typically using an interactive form. Because credentials are sent to the backend and can be stored for future use before being exchanged for an Access Token, it is imperative that the application is absolutely trusted with this information.

Even if this condition is met, the Resource Owner Password Flow should only be used when redirect-based flows (like the Authorization Code Flow) cannot be used.

1. The user clicks Login within the application and enters their credentials.
2. Your application forwards the user's credentials to your Auth0 Authorization Server (/oauth/token endpoint).
3. Your Auth0 Authorization Server validates the credentials.
4. Your Auth0 Authorization Server responds with an Access Token (and optionally, a Refresh Token).
5. Your application can use the Access Token to call an API to access information about the user.
6. The API responds with requested data.

#### Client Credentials Flow

With machine-to-machine (M2M) applications, such as CLIs, daemons, or services running on your back-end, the system authenticates and authorizes the app rather than a user. For this scenario, typical authentication schemes like username + password or social logins don't make sense. Instead, M2M apps use the Client Credentials Flow, in which they pass along their Client ID and Client Secret to authenticate themselves and get a token.

![alt](./docs/images/oauth2-client-credentials-flow.png)

1. Your app authenticates with the Auth0 Authorization Server using its Client ID and Client Secret (`/oauth/token` endpoint).
2. Your Auth0 Authorization Server validates the Client ID and Client Secret.
3. Your Auth0 Authorization Server responds with an Access Token.
4. Your application can use the Access Token to call an API on behalf of itself.
5. The API responds with requested data.

### Endpoints

OAuth 2.0 uses two endpoints: the `/authorization` endpoint and the `/oauth/token` endpoint.

#### Authorization endpoint

The `/authorization` endpoint is used to interact with the resource owner and get the authorization to access the protected resource. To better understand this, imagine that you want to log in to a service using your Google account. First, the service redirects you to Google in order to authenticate (if you are not already logged in) and then you will get a consent screen, where you will be asked to authorize the service to access some of your data (protected resources); for example, your email address and your list of contacts.

The request parameters of the `/authorization` endpoint are:

- **response_type** Tells the authorization server which grant to execute.
- **response_mode** (Optional) How the result of the authorization request is formatted. Values:

  - _query_: for Authorization Code grant. 302 Found triggers redirect.
  - _fragment_: for Implicit grant. 302 Found triggers redirect.
  - _form_post_: 200 OK with response parameters embedded in an HTML form as hidden parameters.
  - _web_message_: For Silent Authentication. Uses HTML5 web messaging.

- **client_id** The ID of the application that asks for authorization.
- **redirect_uri** Holds a URL. A successful response from this endpoint results in a redirect to this URL.
- **scope** A space-delimited list of permissions that the application requires.
- **state** An opaque value, used for security purposes. If this request parameter is set in the request, then it is returned to the application as part of the `redirect_uri`.

This endpoint is used by the Authorization Code and the Implicit grant types. The authorization server needs to know which grant type the application wants to use since it affects the kind of credential it will issue:

- For the Authorization Code grant, it will issue an authorization code (which can later be exchanged with an access token).
- For the Implicit grant, it will issue an access token.

An access token is an opaque string (or a JWT in an Auth0 implementation) that denotes who has authorized which permissions (scopes) to which application. It is meant to be exchanged with an access token at the /oauth/token endpoint. To inform the authorization server which grant type to use, the response_type request parameter is used as follows:

For the Authorization Code grant, use response_type=code to include the authorization code.

For the Implicit grant, use response_type=token to include an access token. An alternative is to use response_type=id_token token to include both an access token and an ID token.

An ID token is a JWT that contains information about the logged in user. It was introduced by OpenID Connect (OIDC).

#### Token endpoint

The `/oauth/token` endpoint is used by the application in order to get an access token or a refresh token. It is used by all flows except for the Implicit Flow because in that case an access token is issued directly.

- In the Authorization Code Flow, the application exchanges the authorization code it got from the authorization endpoint for an access token.
- In the Client Credentials Flow and Resource Owner Password Credentials Grant Exchange, the application authenticates using a set of credentials and then gets an access token.

## OpenID Connect Protocol

OpenID Connect (OIDC) is an identity layer built on top of the OAuth 2.0 framework. It allows third-party applications to verify the identity of the end-user and to obtain basic user profile information. OIDC uses JSON web tokens (JWTs).

While OAuth 2.0 is about resource access and sharing, OIDC is about user authentication. Its purpose is to give you one login for multiple sites. Each time you need to log in to a website using OIDC, you are redirected to your OpenID site where you log in, and then taken back to the website. For example, if you chose to sign in to Auth0 using your Google account then you used OIDC. Once you successfully authenticate with Google and authorize Auth0 to access your information, Google sends information back to Auth0 about the user and the authentication performed. This information is returned in a JWT. You'll receive an access token and if requested, an ID token.

JWTs contain claims, which are statements (such as name or email address) about an entity (typically, the user) and additional metadata. The OpenID Connect specification defines a set of standard claims. The set of standard claims include name, email, gender, birth date, and so on.

## Security Assertion Markup Language Protocol

The Security Assertion Markup Language (SAML) protocol is an open-standard, XML-based framework for authentication and authorization between two entities without a password:

Service provider (SP) agrees to trust the identity provider to authenticate users.

Identity provider (IdP) authenticates users and provides to service providers an authentication assertion that indicates a user has been authenticated.

## Lightweight Directory Access Protocol

The Lightweight Directory Access Protocol (LDAP) is an application protocol, used for accessing and maintaining distributed directory information services over an Internet Protocol (IP) network. The function of LDAP is to enable access to an existing directory like Active Directory.
