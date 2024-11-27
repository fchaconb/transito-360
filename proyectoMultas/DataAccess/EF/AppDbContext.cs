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
        public DbSet<multaPlaca> multaPlacas { get; set; }
        public DbSet<infraccionMulta> infraccionMulta { get; set; }
        public DbSet<Disputas> disputas { get; set; }




        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasMany(t => t.Tickets);

            //Usuario y Placas
            modelBuilder.Entity<Usuario>()
                .HasMany(p => p.Placas);

            //Usuario y Rol
            modelBuilder.Entity<Usuario>()
                .HasOne<Rol>()
                .WithMany()
                .HasForeignKey(r => r.IdRol)
                .OnDelete(DeleteBehavior.NoAction);

            //Correo unico
            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Correo)
                .IsUnique();

            //Many to Many Multas y Infracciones
            modelBuilder.Entity<infraccionMulta>()
                .HasKey(im => new { im.CatalogoInfraccionesId, im.MultasId });

            //Many to Many Multas y Placas
            modelBuilder.Entity<multaPlaca>()
                .HasKey(mp => new { mp.MultasId, mp.PlacasId });

            //1-1 Multas y Usuario Final
            modelBuilder.Entity<Multas>()
                .HasOne<Usuario>()
                .WithMany()
                .HasForeignKey(m => m.IdInfractor)
                .OnDelete(DeleteBehavior.NoAction);

            //1-1 Multas y Usuario Oficial
            modelBuilder.Entity<Multas>()
                .HasOne<Usuario>()
                .WithMany()
                .HasForeignKey(m => m.IdOficial)
                .OnDelete(DeleteBehavior.NoAction);

            // Disputas
            modelBuilder.Entity<Disputas>()
                .HasOne<Multas>()
                .WithMany()
                .HasForeignKey(d => d.idMulta)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Disputas>()
                .HasOne<Usuario>()
                .WithMany()
                .HasForeignKey(d => d.idUsuarioFinal)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Disputas>()
                .HasOne<Usuario>()
                .WithMany()
                .HasForeignKey(d => d.idOficial)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Disputas>()
                .HasOne<Usuario>()
                .WithMany()
                .HasForeignKey(d => d.idJuez)
                .OnDelete(DeleteBehavior.NoAction);

            //Facturas
            modelBuilder.Entity<Facturas>()
                .HasOne<Multas>()
                .WithMany()
                .HasForeignKey(f => f.IdMulta)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Facturas>()
                .HasOne<Usuario>()
                .WithMany()
                .HasForeignKey(f => f.IdUsuario)
                .OnDelete(DeleteBehavior.NoAction);

            //Notificaciones
            modelBuilder.Entity<Notificacion>()
                .HasOne<Usuario>()
                .WithMany()
                .HasForeignKey(n => n.IdUsuario)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
