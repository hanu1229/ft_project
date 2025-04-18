package devconnect.model.entity;

import jakarta.persistence.*;
import lombok.Builder;

@Builder @Entity @Table( name = "developer" )
public class DeveloperEntity {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private int dno;
    @Column( length = 30, nullable = false, unique = true )
    private String did;
    private String dpwd;
    private String dname;
}
