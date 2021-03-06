package ch.japt.epj.model.data;

import java.util.ArrayList;
import java.util.Collection;
import javax.persistence.*;

@Entity
public class Role {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long roleId;

  @Enumerated(EnumType.STRING)
  @Column(length = 60)
  private RoleName name;

  @ManyToMany(mappedBy = "roles")
  private Collection<Person> persons = new ArrayList<>();

  public long getRoleId() {
    return roleId;
  }

  public RoleName getName() {
    return name;
  }

  public void setName(RoleName name) {
    this.name = name;
  }
}
