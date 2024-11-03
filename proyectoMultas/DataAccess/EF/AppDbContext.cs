using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DTO;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Numerics;

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
        public DbSet<CatalogoInfracciones> CatalogoInfracciones { get; set; }
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

            modelBuilder.Entity<Usuario>()
                .HasMany(p => p.Placas);

            modelBuilder.Entity<Usuario>()
                .HasOne<Rol>()
                .WithMany()
                .HasForeignKey(r => r.IdRol);

            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Correo);

            modelBuilder.Entity<Usuario>()
                .HasMany(u => u.Notificaciones)
                .WithOne(n => n.Usuario)
                .HasForeignKey(n => n.IdUsuario);

            modelBuilder.Entity<Usuario>()
                .HasMany(u => u.Facturas)
                .WithOne(f => f.Usuario)
                .HasForeignKey(f => f.IdUsuario);

            modelBuilder.Entity<Facturas>()
                .HasOne<Multas>()
                .WithMany()
                .HasForeignKey(f => f.IdMulta);

            modelBuilder.Entity<infraccionMulta>()
                .HasOne(im => im.Multa)
                .WithMany()
                .HasForeignKey(im => im.idMulta);

            modelBuilder.Entity<infraccionMulta>()
                .HasOne(im => im.Infraccion)
                .WithMany()
                .HasForeignKey(im => im.idInfraccion);

            modelBuilder.Entity<infraccionMulta>()
                .HasIndex(im => new { im.idMulta, im.idInfraccion })
                .IsUnique();

            modelBuilder.Entity<Disputas>()
                .HasOne(d => d.UsuarioFinal)
                .WithMany()
                .HasForeignKey(d => d.IdUsuarioFinal);

            modelBuilder.Entity<Disputas>()
                .HasOne(d => d.UsuarioOficial)
                .WithMany()
                .HasForeignKey(d => d.IdOficial);

            modelBuilder.Entity<Disputas>()
                .HasOne(d => d.Juez)
                .WithMany()
                .HasForeignKey(d => d.IdJuez);

            modelBuilder.Entity<Disputas>()
                .HasOne(d => d.Multa)
                .WithMany()
                .HasForeignKey(d => d.idMulta);


        }


    }
}
