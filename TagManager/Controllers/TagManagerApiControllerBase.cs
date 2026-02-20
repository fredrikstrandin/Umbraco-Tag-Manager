using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Cms.Web.Common.Routing;

namespace Umbraco_Tag_Manager.Controllers
{
    /// <summary>
    /// Base controller for TagManager API endpoints
    /// </summary>
   
[ApiController]
[BackOfficeRoute("TagManager/api/v{version:apiVersion}/TagManager")]
[Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
[MapToApi("TagManager")]
    public class TagManagerApiControllerBase : ControllerBase
    {
    }
}

