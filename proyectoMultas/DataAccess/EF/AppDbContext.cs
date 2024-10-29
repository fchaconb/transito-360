using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DTO;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace DataAccess.EF
{
    public class AppDbContext : IdentityDbContext<IdentityUser>
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Rol> Roles { get; set; }
        public DbSet<Notificacion> Notificacions { get; set; }
        public DbSet<Placas> Placas { get; set; }
        public DbSet<CatalogoInfracciones> CatalogoInfracciones{ get; set; }
        public DbSet<Multas> Multas { get; set; }
        public DbSet<Facturas> Facturas { get; set; }
        public DbSet<Permisos> Permisos { get; set; }
        public DbSet<RolPermiso> RolPermisos { get; set; }
        public DbSet<usuarioPlaca> usuarioPlacas { get; set; }
        public DbSet<multaPlaca> multaPlacas { get; set; }
        public DbSet<infraccionMulta> infraccionMulta { get; set; }




        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasMany(t => t.Tickets);

            modelBuilder.Entity<Usuario>()
                .HasOne<Rol>()
                .WithMany()
                .HasForeignKey(r => r.IdRol);
        }
    }
}
