using InternUp.Application.Admin;
using InternUp.Application.Home;
using InternUp.Application.Ports.Inbound;
using InternUp.Application.Universities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace InternUp.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.TryAddSingleton(TimeProvider.System);
        services.AddScoped<IHomeUseCases, HomeService>();
        services.AddScoped<IAdminHomeUseCases, AdminHomeService>();
        services.AddScoped<IUniversityUseCases, UniversityService>();
        return services;
    }
}
